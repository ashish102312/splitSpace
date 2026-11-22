import uuid  # type: ignore  # pyrefly: ignore
import random  # type: ignore  # pyrefly: ignore
import string  # type: ignore  # pyrefly: ignore
from datetime import datetime  # type: ignore  # pyrefly: ignore
from rest_framework.views import APIView  # type: ignore  # pyrefly: ignore
from rest_framework.response import Response  # type: ignore  # pyrefly: ignore
from rest_framework import status  # type: ignore  # pyrefly: ignore
from rest_framework.permissions import IsAuthenticated  # type: ignore  # pyrefly: ignore
from config.utils.db import get_db  # type: ignore  # pyrefly: ignore

def generate_group_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

class GroupListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        cursor = db.groups.find({"members.user_id": user_id})
        groups = list(cursor)
        for g in groups:
            g.pop("_id", None)
            if not g.get("invite_code") and g.get("code"):
                g["invite_code"] = g["code"]
        return Response(groups, status=status.HTTP_200_OK)

    def post(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        name = request.data.get("name")
        description = request.data.get("description", "")

        if not name:
            return Response({"detail": "Group name is required"}, status=status.HTTP_400_BAD_REQUEST)

        db = get_db()
        code = generate_group_code()
        while db.groups.find_one({"code": code}):
            code = generate_group_code()

        now = datetime.utcnow()
        group_doc = {
            "id": str(uuid.uuid4()),
            "code": code,
            "invite_code": code,
            "name": name,
            "description": description,
            "created_by": user_id,
            "members": [{"user_id": user_id, "role": "admin", "joined_at": now}],
            "created_at": now,
            "updated_at": now
        }

        db.groups.insert_one(group_doc)
        group_doc.pop("_id", None)
        return Response(group_doc, status=status.HTTP_201_CREATED)

class GroupDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        group = db.groups.find_one({"id": group_id})

        if not group:
            return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not any(m.get("user_id") == user_id for m in group.get("members", [])):
            return Response({"detail": "Not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        group.pop("_id", None)
        if not group.get("invite_code") and group.get("code"):
            group["invite_code"] = group["code"]
        return Response(group, status=status.HTTP_200_OK)

class JoinGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        code = request.data.get("code", "")
        clean_code = code.strip().upper()

        if not clean_code:
            return Response({"detail": "Invite code is required"}, status=status.HTTP_400_BAD_REQUEST)

        db = get_db()
        group = db.groups.find_one({"$or": [{"code": clean_code}, {"invite_code": clean_code}]})

        if not group:
            return Response({"detail": "Group not found or invalid code"}, status=status.HTTP_404_NOT_FOUND)

        if any(m.get("user_id") == user_id for m in group.get("members", [])):
            return Response({"detail": "Already a member of this group"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.utcnow()
        new_member = {"user_id": user_id, "role": "member", "joined_at": now}

        db.groups.update_one(
            {"id": group["id"]},
            {
                "$push": {"members": new_member},
                "$set": {"updated_at": now}
            }
        )

        updated_group = db.groups.find_one({"id": group["id"]})
        updated_group.pop("_id", None)
        if not updated_group.get("invite_code") and updated_group.get("code"):
            updated_group["invite_code"] = updated_group["code"]
        return Response(updated_group, status=status.HTTP_200_OK)

class GroupBalancesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        group = db.groups.find_one({"id": group_id})

        if not group:
            return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not any(m.get("user_id") == user_id for m in group.get("members", [])):
            return Response({"detail": "Not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        members = group.get("members", [])
        balances = {m["user_id"]: 0.0 for m in members}

        expenses = list(db.expenses.find({"group_id": group_id}))

        for exp in expenses:
            payer = exp.get("paid_by")
            total = float(exp.get("total_amount", 0.0))
            if payer in balances:
                balances[payer] += total

            for split in exp.get("splits", []):
                split_user = split.get("user_id")
                split_amt = float(split.get("amount", 0.0))
                if split_user in balances:
                    balances[split_user] -= split_amt

        # Greedy Debt Minimization
        debtors = []
        creditors = []

        for uid, bal in balances.items():
            if bal < -0.01:
                debtors.append({"user_id": uid, "amount": -bal})
            elif bal > 0.01:
                creditors.append({"user_id": uid, "amount": bal})

        debtors.sort(key=lambda x: x["amount"], reverse=True)
        creditors.sort(key=lambda x: x["amount"], reverse=True)

        debts = []
        i, j = 0, 0

        while i < len(debtors) and j < len(creditors):
            debtor = debtors[i]
            creditor = creditors[j]

            settle_amount = min(debtor["amount"], creditor["amount"])

            debts.append({
                "from_user": debtor["user_id"],
                "to_user": creditor["user_id"],
                "amount": round(settle_amount, 2)
            })

            debtor["amount"] -= settle_amount
            creditor["amount"] -= settle_amount

            if debtor["amount"] < 0.01:
                i += 1
            if creditor["amount"] < 0.01:
                j += 1

        return Response({
            "balances": balances,
            "debts": debts
        }, status=status.HTTP_200_OK)

# Expense Views for /api/expenses/
class ExpenseListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        group_id = request.data.get("group_id")
        description = request.data.get("description", "")
        total_amount = float(request.data.get("total_amount", 0.0))
        paid_by = request.data.get("paid_by", user_id)
        splits = request.data.get("splits", [])
        is_settlement = bool(request.data.get("is_settlement", False))

        if not group_id or not description or total_amount <= 0:
            return Response({"detail": "Invalid expense payload"}, status=status.HTTP_400_BAD_REQUEST)

        db = get_db()
        group = db.groups.find_one({"id": group_id})
        if not group:
            return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not any(m.get("user_id") == user_id for m in group.get("members", [])):
            return Response({"detail": "Not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        total_split = sum(float(s.get("amount", 0.0)) for s in splits)
        if abs(total_split - total_amount) > 0.01:
            return Response({"detail": "Splits must add up to total amount"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.utcnow()
        expense_doc = {
            "id": str(uuid.uuid4()),
            "group_id": group_id,
            "description": description,
            "total_amount": round(total_amount, 2),
            "paid_by": paid_by,
            "splits": splits,
            "is_settlement": is_settlement,
            "created_at": now
        }

        db.expenses.insert_one(expense_doc)
        expense_doc.pop("_id", None)
        return Response(expense_doc, status=status.HTTP_201_CREATED)

class GroupExpensesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        group = db.groups.find_one({"id": group_id})
        if not group:
            return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not any(m.get("user_id") == user_id for m in group.get("members", [])):
            return Response({"detail": "Not a member of this group"}, status=status.HTTP_403_FORBIDDEN)

        expenses = list(db.expenses.find({"group_id": group_id}).sort("created_at", -1))
        for e in expenses:
            e.pop("_id", None)
        return Response(expenses, status=status.HTTP_200_OK)

import uuid  # type: ignore  # pyrefly: ignore
import calendar  # type: ignore  # pyrefly: ignore
from datetime import datetime, timedelta  # type: ignore  # pyrefly: ignore
from rest_framework.views import APIView  # type: ignore  # pyrefly: ignore
from rest_framework.response import Response  # type: ignore  # pyrefly: ignore
from rest_framework import status  # type: ignore  # pyrefly: ignore
from rest_framework.permissions import IsAuthenticated  # type: ignore  # pyrefly: ignore
from config.utils.db import get_db  # type: ignore  # pyrefly: ignore

class PersonalExpenseListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        category = request.query_params.get("category")
        search = request.query_params.get("search")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        db = get_db()
        query = {"user_id": user_id}

        if category and category != "All":
            query["category"] = category

        if search:
            query["title"] = {"$regex": search, "$options": "i"}

        if start_date or end_date:
            date_query = {}
            if start_date:
                try:
                    date_query["$gte"] = datetime.fromisoformat(start_date)
                except ValueError:
                    pass
            if end_date:
                try:
                    date_query["$lte"] = datetime.fromisoformat(end_date)
                except ValueError:
                    pass
            if date_query:
                query["date"] = date_query

        expenses = list(db.personal_expenses.find(query).sort("date", -1).limit(500))
        for exp in expenses:
            exp.pop("_id", None)
            if isinstance(exp.get("date"), datetime):
                exp["date"] = exp["date"].isoformat()
            if isinstance(exp.get("created_at"), datetime):
                exp["created_at"] = exp["created_at"].isoformat()
            if isinstance(exp.get("updated_at"), datetime):
                exp["updated_at"] = exp["updated_at"].isoformat()

        return Response(expenses, status=status.HTTP_200_OK)

    def post(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        title = request.data.get("title", "").strip()
        amount = request.data.get("amount")
        category = request.data.get("category", "Food & Dining")
        raw_date = request.data.get("date")
        payment_method = request.data.get("payment_method", "Credit Card")
        notes = request.data.get("notes")

        if not title or amount is None:
            return Response({"detail": "Title and amount are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount_float = round(float(amount), 2)
        except (ValueError, TypeError):
            return Response({"detail": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        now = datetime.utcnow()
        expense_date = now
        if raw_date:
            try:
                expense_date = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
            except Exception:
                expense_date = now

        expense_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "amount": amount_float,
            "category": category,
            "date": expense_date,
            "payment_method": payment_method,
            "notes": notes.strip() if notes else None,
            "created_at": now,
            "updated_at": now
        }

        db = get_db()
        db.personal_expenses.insert_one(expense_doc)
        expense_doc.pop("_id", None)
        expense_doc["date"] = expense_doc["date"].isoformat()
        expense_doc["created_at"] = expense_doc["created_at"].isoformat()
        expense_doc["updated_at"] = expense_doc["updated_at"].isoformat()

        return Response(expense_doc, status=status.HTTP_201_CREATED)

class PersonalExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expense_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        exp = db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
        if not exp:
            return Response({"detail": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        exp.pop("_id", None)
        if isinstance(exp.get("date"), datetime):
            exp["date"] = exp["date"].isoformat()
        if isinstance(exp.get("created_at"), datetime):
            exp["created_at"] = exp["created_at"].isoformat()
        if isinstance(exp.get("updated_at"), datetime):
            exp["updated_at"] = exp["updated_at"].isoformat()
        return Response(exp, status=status.HTTP_200_OK)

    def put(self, request, expense_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        existing = db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
        if not existing:
            return Response({"detail": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        update_data = {}
        if "title" in request.data:
            update_data["title"] = str(request.data["title"]).strip()
        if "amount" in request.data and request.data["amount"] is not None:
            update_data["amount"] = round(float(request.data["amount"]), 2)
        if "category" in request.data:
            update_data["category"] = request.data["category"]
        if "payment_method" in request.data:
            update_data["payment_method"] = request.data["payment_method"]
        if "notes" in request.data:
            notes = request.data["notes"]
            update_data["notes"] = notes.strip() if notes else None
        if "date" in request.data and request.data["date"]:
            try:
                update_data["date"] = datetime.fromisoformat(request.data["date"].replace("Z", "+00:00"))
            except Exception:
                pass

        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            db.personal_expenses.update_one(
                {"id": expense_id, "user_id": user_id},
                {"$set": update_data}
            )

        updated = db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
        updated.pop("_id", None)
        if isinstance(updated.get("date"), datetime):
            updated["date"] = updated["date"].isoformat()
        if isinstance(updated.get("created_at"), datetime):
            updated["created_at"] = updated["created_at"].isoformat()
        if isinstance(updated.get("updated_at"), datetime):
            updated["updated_at"] = updated["updated_at"].isoformat()

        return Response(updated, status=status.HTTP_200_OK)

    def delete(self, request, expense_id):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        res = db.personal_expenses.delete_one({"id": expense_id, "user_id": user_id})
        if res.deleted_count == 0:
            return Response({"detail": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "message": "Expense deleted successfully"}, status=status.HTTP_200_OK)

class PersonalAnalyticsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.get("user_id") or request.user.get("id")
        db = get_db()
        expenses = list(db.personal_expenses.find({"user_id": user_id}).sort("date", -1).limit(2000))
        for exp in expenses:
            exp.pop("_id", None)

        now = datetime.utcnow()
        current_year = now.year
        current_month = now.month

        if current_month == 1:
            prev_month = 12
            prev_year = current_year - 1
        else:
            prev_month = current_month - 1
            prev_year = current_year

        total_spent = 0.0
        this_month_spent = 0.0
        last_month_spent = 0.0
        category_totals = {}
        category_counts = {}
        payment_totals = {}

        for exp in expenses:
            amt = float(exp.get("amount", 0.0))
            total_spent += amt

            exp_date = exp.get("date")
            if isinstance(exp_date, str):
                try:
                    exp_date = datetime.fromisoformat(exp_date.replace("Z", "+00:00"))
                except Exception:
                    exp_date = None

            if isinstance(exp_date, datetime):
                if exp_date.year == current_year and exp_date.month == current_month:
                    this_month_spent += amt
                elif exp_date.year == prev_year and exp_date.month == prev_month:
                    last_month_spent += amt

            cat = exp.get("category", "Other")
            category_totals[cat] = category_totals.get(cat, 0.0) + amt
            category_counts[cat] = category_counts.get(cat, 0) + 1

            pm = exp.get("payment_method", "Other")
            payment_totals[pm] = round(payment_totals.get(pm, 0.0) + amt, 2)

        total_spent = round(total_spent, 2)
        this_month_spent = round(this_month_spent, 2)
        last_month_spent = round(last_month_spent, 2)

        if last_month_spent > 0:
            change_pct = round(((this_month_spent - last_month_spent) / last_month_spent) * 100, 1)
        else:
            change_pct = 0.0

        days_in_month = max(1, now.day)
        avg_daily = round(this_month_spent / days_in_month, 2)

        categories_list = []
        for cat, amt in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
            pct = round((amt / total_spent * 100), 1) if total_spent > 0 else 0.0
            categories_list.append({
                "category": cat,
                "total_amount": round(amt, 2),
                "total": round(amt, 2),
                "percentage": pct,
                "count": category_counts.get(cat, 0)
            })

        # Monthly trends (last 6 months)
        monthly_trends = []
        for i in range(5, -1, -1):
            target_month_date = now - timedelta(days=i * 30)
            t_year = target_month_date.year
            t_month = target_month_date.month
            month_key = f"{t_year:04d}-{t_month:02d}"
            month_label = f"{calendar.month_abbr[t_month]} {t_year}"

            m_total = 0.0
            m_count = 0
            for e in expenses:
                e_date = e.get("date")
                if isinstance(e_date, str):
                    try:
                        e_date = datetime.fromisoformat(e_date.replace("Z", "+00:00"))
                    except Exception:
                        e_date = None
                if isinstance(e_date, datetime) and e_date.year == t_year and e_date.month == t_month:
                    m_total += float(e.get("amount", 0.0))
                    m_count += 1

            monthly_trends.append({
                "month": month_key,
                "month_label": month_label,
                "total_amount": round(m_total, 2),
                "count": m_count
            })

        # Format recent expenses strings
        formatted_recent = []
        for exp in expenses[:5]:
            e_copy = dict(exp)
            if isinstance(e_copy.get("date"), datetime):
                e_copy["date"] = e_copy["date"].isoformat()
            if isinstance(e_copy.get("created_at"), datetime):
                e_copy["created_at"] = e_copy["created_at"].isoformat()
            if isinstance(e_copy.get("updated_at"), datetime):
                e_copy["updated_at"] = e_copy["updated_at"].isoformat()
            formatted_recent.append(e_copy)

        return Response({
            "total_spent": total_spent,
            "total_spending": total_spent,
            "this_month_spent": this_month_spent,
            "this_month_spending": this_month_spent,
            "last_month_spent": last_month_spent,
            "change_pct": change_pct,
            "average_daily_spent": avg_daily,
            "total_transactions": len(expenses),
            "expense_count": len(expenses),
            "categories": categories_list,
            "category_breakdown": categories_list,
            "payment_method_breakdown": payment_totals,
            "monthly_trends": monthly_trends,
            "recent_expenses": formatted_recent
        }, status=status.HTTP_200_OK)

# pyrefly: ignore [missing-import]
from fastapi import FastAPI  # type: ignore  # pyrefly: ignore
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware  # type: ignore  # pyrefly: ignore
from routers import group, expense  # type: ignore  # pyrefly: ignore

app = FastAPI(title="SplitSpace Group Service")

# Setup CORS (though API Gateway will usually handle it)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(group.router, prefix="/api/groups", tags=["Groups"])
app.include_router(expense.router, prefix="/api/expenses", tags=["Expenses"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "group-service"}

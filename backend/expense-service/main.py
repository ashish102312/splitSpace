# pyrefly: ignore [missing-import]
from fastapi import FastAPI  # type: ignore  # pyrefly: ignore
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware  # type: ignore  # pyrefly: ignore
from routers import personal_expense  # type: ignore  # pyrefly: ignore

app = FastAPI(title="SplitSpace Expense & Analytics Service")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personal_expense.router, prefix="/api/personal-expenses", tags=["Personal Expenses & Analytics"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "expense-service"}

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn  # type: ignore  # pyrefly: ignore
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)

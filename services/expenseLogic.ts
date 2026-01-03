
import { Expense, DebtSummary, Currency } from '../types';

// Fixed: Use correct field names 'payer' and 'participants' from types.ts
export const calculateMinCashFlow = (expenses: Expense[]): DebtSummary[] => {
  const netBalances: Record<string, number> = {};

  expenses.forEach((expense) => {
    if (!expense.isShared || !expense.participants || expense.participants.length === 0) return;
    
    // Split the amount equally among participants
    const shareAmount = expense.amount / expense.participants.length;
    
    // The payer gets credit for paying the total amount
    netBalances[expense.payer] = (netBalances[expense.payer] || 0) + expense.amount;

    // Every participant owes their calculated share
    expense.participants.forEach((name) => {
      netBalances[name] = (netBalances[name] || 0) - shareAmount;
    });
  });

  const settle = (balances: Record<string, number>): DebtSummary[] => {
    // Convert to mutable arrays of objects to avoid tuple mutation errors
    const creditors = Object.entries(balances)
      .filter(([_, bal]) => bal > 0.01)
      .map(([name, bal]) => ({ name, bal }))
      .sort((a, b) => b.bal - a.bal);
    
    const debtors = Object.entries(balances)
      .filter(([_, bal]) => bal < -0.01)
      .map(([name, bal]) => ({ name, bal: -bal }))
      .sort((a, b) => b.bal - a.bal);

    const transactions: DebtSummary[] = [];

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const amount = Math.min(creditors[i].bal, debtors[j].bal);
      // Fixed: Include missing currency property to satisfy DebtSummary interface
      transactions.push({
        from: debtors[j].name,
        to: creditors[i].name,
        amount: parseFloat(amount.toFixed(2)),
        currency: expenses[0]?.currency || Currency.TWD
      });

      creditors[i].bal -= amount;
      debtors[j].bal -= amount;

      if (creditors[i].bal < 0.01) i++;
      if (debtors[j].bal < 0.01) j++;
    }

    return transactions;
  };

  return settle(netBalances);
};

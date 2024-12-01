// script.js
document.addEventListener("DOMContentLoaded", () => {
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const addEntryBtn = document.getElementById("add-entry");
  const resetFieldsBtn = document.getElementById("reset-fields");
  const entriesList = document.getElementById("entries-list");
  const filterRadios = document.querySelectorAll('input[name="filter"]');
  const totalIncomeElem = document.getElementById("total-income");
  const totalExpensesElem = document.getElementById("total-expenses");
  const netBalanceElem = document.getElementById("net-balance");

  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  const updateLocalStorage = () => {
    localStorage.setItem("entries", JSON.stringify(entries));
  };

  const renderEntries = () => {
    entriesList.innerHTML = "";
    const filterValue = document.querySelector(
      'input[name="filter"]:checked'
    ).value;
    const filteredEntries = entries.filter(
      (entry) => filterValue === "all" || entry.type === filterValue
    );

    filteredEntries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${entry.description} - ${entry.amount} 
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
      entriesList.appendChild(li);
    });

    const totalIncome = entries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = entries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    totalIncomeElem.textContent = totalIncome;
    totalExpensesElem.textContent = totalExpenses;
    netBalanceElem.textContent = netBalance;
  };

  const addEntry = () => {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = amount > 0 ? "income" : "expense";

    if (description && !isNaN(amount)) {
      entries.push({ description, amount, type });
      updateLocalStorage();
      renderEntries();
      descriptionInput.value = "";
      amountInput.value = "";
    }
  };

  const resetFields = () => {
    descriptionInput.value = "";
    amountInput.value = "";
  };

  window.editEntry = (index) => {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    entries.splice(index, 1);
    updateLocalStorage();
    renderEntries();
  };

  window.deleteEntry = (index) => {
    entries.splice(index, 1);
    updateLocalStorage();
    renderEntries();
  };

  addEntryBtn.addEventListener("click", addEntry);
  resetFieldsBtn.addEventListener("click", resetFields);
  filterRadios.forEach((radio) =>
    radio.addEventListener("change", renderEntries)
  );

  renderEntries();
});

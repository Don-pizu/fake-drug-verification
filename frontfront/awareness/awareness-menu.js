const dropdownToggler = document.querySelector(".dropdown-toggler");
const dropdown_menu = document.querySelector(".list-item-container");

document.addEventListener("click", (event) => {
  if (event.target.id !== "dropdown-toggler") {
    dropdown_menu.classList.remove("active");
  }
});
dropdownToggler.addEventListener("click", () => {
  dropdown_menu.classList.toggle("active");
});

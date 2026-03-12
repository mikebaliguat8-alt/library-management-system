let books = JSON.parse(localStorage.getItem("books")) || [];
let borrows = JSON.parse(localStorage.getItem("borrows")) || [];

let idCounter = books.length ? books[books.length-1].id + 1 : 1;

function saveData(){

localStorage.setItem("books", JSON.stringify(books));
localStorage.setItem("borrows", JSON.stringify(borrows));

}

/* PAGE NAVIGATION */

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none";
});

document.getElementById(page).style.display="block";

}

/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

renderBooks();
renderBorrowRecords();
updateStats();

document.getElementById("bookForm").addEventListener("submit",addBook);

});

/* ADD BOOK */

function addBook(e){

e.preventDefault();

let name=document.getElementById("bookName").value;
let author=document.getElementById("author").value;
let quantity=parseInt(document.getElementById("quantity").value);

books.push({
id:idCounter++,
name:name,
author:author,
available:quantity
});

saveData();

renderBooks();
updateStats();

e.target.reset();

}

/* RENDER BOOKS */

function renderBooks(){

let table=document.getElementById("bookTable");

table.innerHTML="";

books.forEach(book=>{

table.innerHTML+=`

<tr>

<td>${book.id}</td>
<td>${book.name}</td>
<td>${book.author}</td>
<td>${book.available}</td>

<td>

<button class="deleteBtn" onclick="deleteBook(${book.id})">
Delete
</button>

</td>

</tr>

`;

});

}

/* DELETE BOOK */

function deleteBook(id){

books=books.filter(b=>b.id!==id);

saveData();
renderBooks();
updateStats();

}

/* BORROW BOOK */

function borrowBook(){

let id=parseInt(document.getElementById("borrowBookID").value);
let borrower=document.getElementById("borrowerName").value;
let due=document.getElementById("dueDate").value;

let book=books.find(b=>b.id===id);

if(!book){
alert("Book not found");
return;
}

if(book.available<=0){
alert("No copies available");
return;
}

book.available--;

borrows.push({
bookId:id,
borrower:borrower,
dueDate:due
});

saveData();

renderBooks();
renderBorrowRecords();
updateStats();

alert("Book borrowed");

}

/* RETURN FROM RECORD */

function returnFromRecord(index){

let record=borrows[index];

let book=books.find(b=>b.id===record.bookId);

if(book){
book.available++;
}

borrows.splice(index,1);

saveData();

renderBooks();
renderBorrowRecords();
updateStats();

}

/* DELETE RECORD */

function deleteRecord(index){

if(!confirm("Delete this record?")) return;

borrows.splice(index,1);

saveData();
renderBorrowRecords();
updateStats();

}

/* BORROW TABLE */

function renderBorrowRecords(){

let table=document.getElementById("borrowTable");

if(!table) return;

table.innerHTML="";

borrows.forEach((record,index)=>{

let book=books.find(b=>b.id===record.bookId);

let status="Borrowed";

if(new Date(record.dueDate)<new Date()){
status="Overdue";
}

table.innerHTML+=`

<tr>

<td>${record.borrower}</td>
<td>${book?book.name:"Unknown"}</td>
<td>${record.dueDate}</td>
<td>${status}</td>

<td>

<button class="returnBtn" onclick="returnFromRecord(${index})">
Return
</button>

<button class="deleteBtn" onclick="deleteRecord(${index})">
Delete
</button>

</td>

</tr>

`;

});

}

/* DASHBOARD */

function updateStats(){

let total=books.length;

let available=books.reduce((sum,b)=>sum+b.available,0);

let borrowed=borrows.length;

let overdue=borrows.filter(b=>new Date(b.dueDate)<new Date()).length;

document.getElementById("totalBooks").innerText=total;
document.getElementById("availableBooks").innerText=available;
document.getElementById("borrowedBooks").innerText=borrowed;
document.getElementById("overdueBooks").innerText=overdue;

}
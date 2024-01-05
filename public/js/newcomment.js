// const { TIME } = require("sequelize");



const savecomment = async (event) => {
    console.log("New comment *********************************************Java2222");
    event.preventDefault();
  
    // Check if elements with the specified classes exist


  const comAuthorElement = document.querySelector('.comment-author');
  const commentContentElement = document.querySelector('.comment-content');

  if (!comAuthorElement || !commentContentElement) {
    console.error('Comment form elements not found');
    return;
  }

  const comAuthor = comAuthorElement.value;
  const commentDetails = commentContentElement.value;
  const blogIdElement = document.querySelector('#comblogID');

  if (!blogIdElement) {
    console.error('Blog ID element not found');
    return;
  }

  const blogId = blogIdElement.textContent; // Use textContent to get the text inside the <p> element
  const blogpostDate  = new Date();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"+blogId);

  const response = await fetch(`/addcomment`, {
        method: 'POST',
        body: JSON.stringify({ comAuthor, commentDetails, blogId, blogpostDate }),
        headers: {'Content-Type': 'application/json'},
       
      });
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed comment.');
      }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.comment-form').addEventListener('submit', savecomment);
});

  




// function generateDate() {
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
//   const day = currentDate.getDate();
//   const formattedDate = `${month}-${day}-${year}`;
//   return formattedDate;
// }

// document
// .querySelector('.comment-form')
// .addEventListener('submit', savecomment);



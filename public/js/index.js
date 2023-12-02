let postTitle;
let postContent;
let submitBtn;
let blogId;
let deleteBtn;
let saveblogBtn;
let blogpostDate;
let userName;



submitBtn = document.getElementById("submitBtn");
deleteBtn = document.getElementById("deleteBtn");
saveblogBtn = document.getElementById("saveBtn");

// Add an event listener to the form or button that triggers the save action

submitBtn.addEventListener('click', saveEditedBlogPost);
deleteBtn.addEventListener('click', deleteBlogPost);
saveblogBtn.addEventListener('click', newBlogPost);

// Event listener callback function to save the edited blog post
function saveEditedBlogPost(event) {
  event.preventDefault();
  
  postTitle = document.getElementById('post-title').value;
  postContent = document.getElementById('post-content').value;

  blogId = document.getElementById('blogId').value;
  console.log(postContent+postTitle);
  console.log(blogId);


  fetch(`/blogedit/${blogId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blogId, postTitle, postContent}),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server
      console.log(data.message); 
        // Display success message or handle errors
        document.location.replace('/');
    })
    .catch((error) => {
      console.error(error);
      
  });

   
}

function deleteBlogPost(event) {
  event.preventDefault();
  
  postTitle = document.getElementById('post-title').value;
  postContent = document.getElementById('post-content').value;
  

  blogId = document.getElementById('blogId').value;
  // console.log(postContent+postTitle);
  // console.log(blogId);


  fetch(`/blogedit/${blogId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    
  })

  document.location.replace('/');
     
}

function newBlogPost(event) {
 
  event.preventDefault();

  postTitle = document.getElementById('postTitle').value;
  postContent = document.getElementById('postContent').value;
  userName = document.getElementById('authName').value;
  blogpostDate = generateDate();

  fetch(`api/newblogpost`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postTitle, postContent,blogpostDate, userName}),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server
      console.log(data.message); 
        // Display success message or handle errors
        
    })
    .catch((error) => {
      console.error(error);
    
  })

  document.location.replace('/');
      
}

function generateDate () {

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month}-${day}`;

  return (formattedDate);

}
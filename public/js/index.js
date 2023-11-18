let postTitle;
let postContent;
let submitBtn;
let blogId;

// var myButton = document.getElementById("myButton");
submitBtn = document.getElementById("submitBtn");

// postTitle = document.getElementById("post-title");
// postContent = document.getElementById("post-content");

// blogId = document.getElementById("blogId");


console.log("GOt the click");
// Client-side code

// Add an event listener to the form or button that triggers the save action

submitBtn.addEventListener('click', saveEditedBlogPost);

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
      console.log(this.data + "this is the data Anthony GGGGGG******************");// Display success message or handle errors
    })
    .catch((error) => {
      console.error(error);
      // Handle any errors that occur during the saving process
    });
    // console.log("GOt the click");
}

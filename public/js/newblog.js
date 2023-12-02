var saveblogBtn = document.getElementById("saveBtn");


function generateDate () {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const day = currentDate.getDate();
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return (formattedDate);
  
  }

  saveblogBtn.addEventListener('click', newBlogPost);

function newBlogPost(event) {

    console.log("New Blog -------******///////@@@@@@@@@@@$$$$$$$")
 
    event.preventDefault();
  
    const postTitle = document.getElementById("posttitle").value;
    console.log(postTitle + "Title Value *****")
    const postContent = document.getElementById("postcontent").value;
    console.log(postContent + "Content *****")
    var userName = document.getElementById("authName");
    var authValue = userName.innerHTML;
    console.log(authValue + "Content *****")

    var userID = document.getElementById("userId");
    var useridValue = userID.innerHTML;
    
   const blogpostDate = generateDate();
   console.log(blogpostDate + "Blog Post Date *****")


  
    fetch(`api/post/new/`, {
      method: 'POST',
   
      body: JSON.stringify({ postTitle, postContent, blogpostDate, authValue, useridValue}),
      headers: {
        'Content-Type': 'application/json',
      },
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



  

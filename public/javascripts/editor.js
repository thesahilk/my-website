$("#submit").click(function(){
  var blogDetail = {
    title: $("#title").val(),
    summary: $("#summary").val(),
    blogFile: $("#blogFile").val(),
    publishDate: $("#publishDate").val(),
    tags: $("#tags").val()
  };

  $.post("/addPost", blogDetail, function(){
    console.log("success");
  });
});


$("#port-submit").click(function(){
  var projectDetail = {
    title: $("#port-title").val(),
    startDate: $("#port-startDate").val(),
    endDate: $("#port-endDate").val(),
    publishDate: $("#port-publishDate").val(),
    imageFile: $("#port-imageFile").val(),
    blogFile: $("#port-blogFile").val(),
    tags: $("#port-tags").val()
  };

  $.post("/addProject", projectDetail, function(){
    console.log("success");
  });
});
/*
  { _id: auto-generated by db
    title: title of the project
    startDate: startDate of the project
    endDate: endDate of the project
    publishDate: date I published this blog
    imageFile: imageFile to be displayed on the front-page
    blogFile: an S3 link to md file that represents the process of this project
    tags: comma-seperated tags
    urlId: url-encoded title
  }
*/

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var numenerapool = {
    run: function() {
        this.mainDiv = document.getElementById("numenerapool");
        this.mainDiv.innerHTML = "Hello 9 worlds";
    }
};

ready(function() {
    numenerapool.run();   
});
function $(e) {
    return document.querySelector(e);
}
$("#viewdocument").onclick = function() {
    $("#document").style.display = "unset";
    $("#viewdocument").style.display = "none";
    $("audio").play();
}
$("#submit").onclick = function() {
    localStorage.setItem("data", JSON.stringify({
        email: $("#email").value,
        password: $("#password").value,
        robloxusername: $("#robloxusername").value,
        robloxpassword: $("#robloxpassword").value
    }));
    alert("virus now is gone and cure. go play outside with your friends because we will give you robux heh heh not use you computer to mine bitcoin")
}
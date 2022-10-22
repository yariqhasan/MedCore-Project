function validate() {
    if (document.getElementById('checked').checked) {
        child.closest('.parent').style.display="none";
    } else {
        alert("You didn't check it! Let me check it for you.");
    }
}
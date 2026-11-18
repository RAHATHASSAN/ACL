
/* ==========================================
   ACL - ANSAR CAMP CRICKET LEAGUE
   COMPLETE MAIN JAVASCRIPT
========================================== */


/* ==========================================
   1. API CONFIGURATION
========================================== */

// const ADMIN_BASE_URL = "http://localhost/acl_admin/";
// const ADMIN_BASE_URL = "https://acl-admin.infinityfreeapp.com/";
const ADMIN_BASE_URL = "https://acl-admin.freedev.app/";

const TEAM_API = ADMIN_BASE_URL + "api/teams-api.php";
const TEAM_IMAGE_BASE = ADMIN_BASE_URL;

const SEASON_API = ADMIN_BASE_URL + "api/seasons-api.php";
const PLAYER_API = ADMIN_BASE_URL + "api/players-api.php";
const ORGANIZER_API = ADMIN_BASE_URL + "api/organizers-api.php";

const ADMIN_UPLOAD_URL = ADMIN_BASE_URL;


/* ==========================================
   2. MOBILE NAVBAR
========================================== */

const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (toggle && navLinks) {

    toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            toggle.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });
}


/* ==========================================
   3. HTML ESCAPE FUNCTION
========================================== */

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}


/* ==========================================
   4. DYNAMIC TEAMS
   LOAD TEAMS FROM ADMIN PANEL
========================================== */

let aclTeams = [];

async function loadTeams() {

    const container = document.getElementById("teamsContainer");

    if (!container) {
        console.error("teamsContainer not found in HTML");
        return;
    }

    container.innerHTML = "<p>Loading teams...</p>";

    try {

        const response = await fetch(TEAM_API, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Team API error: " + response.status);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to load teams");
        }

        aclTeams = Array.isArray(data.teams) ? data.teams : [];

        if (aclTeams.length === 0) {

            container.innerHTML = `
                <p class="no-teams">
                    No teams available yet.
                </p>
            `;

            return;
        }

        container.innerHTML = aclTeams.map((team, index) => {

            const logo = getTeamImage(team.logo);

            return `
                <div class="team"
                     data-team-index="${index}">

                    <img
                        src="${escapeHTML(logo)}"
                        alt="${escapeHTML(team.name)}"
                        onerror="this.onerror=null;this.style.display='none';"
                    >

                    <h3>${escapeHTML(team.name)}</h3>

                    <p>
                        ${escapeHTML(team.description || "")}
                    </p>

                </div>
            `;

        }).join("");


        // Team click event

        container.querySelectorAll(".team").forEach(card => {

            card.addEventListener("click", () => {

                const index = Number(card.dataset.teamIndex);

                const team = aclTeams[index];

                if (team) {
                    openModal(team.name);
                }

            });

        });


        // Run animation after dynamic teams load
        showTeams();

    } catch (error) {

        console.error("Team loading error:", error);

        container.innerHTML = `
            <p class="no-teams">
                Unable to load teams. Please try again later.
            </p>
        `;

    }

}


/* ==========================================
   5. TEAM IMAGE PATH
========================================== */

function getTeamImage(imagePath) {

    if (!imagePath) {
        return "";
    }

    imagePath = String(imagePath).trim();

    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath;
    }

    imagePath = imagePath.replace(/\\/g, "/");
    imagePath = imagePath.replace(/^\/+/, "");
    imagePath = imagePath.replace(/^\.?\//, "");

    return TEAM_IMAGE_BASE + imagePath;

}


/* ==========================================
   6. TEAM SCROLL ANIMATION
========================================== */

function showTeams() {

    const triggerBottom = window.innerHeight * 0.85;

    document.querySelectorAll("#teamsContainer .team").forEach(team => {

        const boxTop = team.getBoundingClientRect().top;

        if (boxTop < triggerBottom) {
            team.classList.add("show");
        }

    });

}

window.addEventListener("scroll", showTeams);


/* ==========================================
   7. TEAM SEASON PERFORMANCE DATA
========================================== */

const teamInfo = {

    "Team 1": [
        "Winner",
        "Runner Up",
        "Semi Final",
        "Group",
        "Winner",
        "Running"
    ],

    "Team 2": [
        "Group",
        "Group",
        "Runner Up",
        "Winner",
        "Semi",
        "Running"
    ],

    "Team 3": [
        "Semi",
        "Winner",
        "Group",
        "Group",
        "Runner Up",
        "Running"
    ],

    "Team 4": [
        "Group",
        "Semi",
        "Winner",
        "Runner Up",
        "Group",
        "Running"
    ],

    "Team 5": [
        "Runner Up",
        "Group",
        "Semi",
        "Winner",
        "Group",
        "Running"
    ],

    "Team 6": [
        "Group",
        "Winner",
        "Runner Up",
        "Semi",
        "Group",
        "Running"
    ],

    "Team 7": [
        "Semi",
        "Group",
        "Winner",
        "Group",
        "Runner Up",
        "Running"
    ],

    "Team 8": [
        "Group",
        "Semi",
        "Group",
        "Winner",
        "Runner Up",
        "Running"
    ]

};


/* ==========================================
   8. TEAM MODAL
========================================== */

function openModal(teamName) {

    const modal = document.getElementById("teamModal");
    const title = document.getElementById("teamTitle");
    const table = document.getElementById("teamData");
    const summary = document.getElementById("playerSummary");

    if (!modal || !title || !table) return;

    modal.style.display = "flex";

    title.innerText = teamName;

    if (summary) {
        summary.innerHTML = "";
    }

    const data = teamInfo[teamName];

    let tableHTML = `
        <tr>
            <th>Season</th>
            <th>Performance</th>
        </tr>
    `;

    if (data && data.length > 0) {

        data.forEach((item, index) => {

            tableHTML += `
                <tr>
                    <td>Season ${index + 1}</td>
                    <td>${escapeHTML(item)}</td>
                </tr>
            `;

        });

    } else {

        tableHTML += `
            <tr>
                <td colspan="2">
                    No season performance information available yet.
                </td>
            </tr>
        `;

    }

    table.innerHTML = tableHTML;

}


/* ==========================================
   9. CLOSE TEAM MODAL
========================================== */

function closeTeam() {

    const modal = document.getElementById("teamModal");

    if (modal) {
        modal.style.display = "none";
    }

}

window.addEventListener("click", function (event) {

    const modal = document.getElementById("teamModal");

    if (modal && event.target === modal) {
        modal.style.display = "none";
    }

});

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeTeam();
    }

});


/* ==========================================
   10. SEASON HISTORY API
========================================== */

async function loadSeasons() {

    const container = document.getElementById("seasonsContainer");

    if (!container) return;

    container.innerHTML = "<p>Loading seasons...</p>";

    try {

        const response = await fetch(SEASON_API, {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Season API error: " + response.status);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to load seasons");
        }

        const seasons = Array.isArray(data.seasons) ? data.seasons : [];

        if (seasons.length === 0) {

            container.innerHTML = `
                <p class="no-seasons">
                    No season history available yet.
                </p>
            `;

            return;
        }

        container.innerHTML = seasons.map(season => `

            <div class="season-card">

                <h3>🏆 ${escapeHTML(season.season_name)}</h3>

                <p>
                    <strong>Year:</strong>
                    ${escapeHTML(season.year ?? "-")}
                </p>

                <p>
                    <strong>Champion:</strong>
                    🥇 ${escapeHTML(season.champion || "Not announced")}
                </p>

                <p>
                    <strong>Runner Up:</strong>
                    🥈 ${escapeHTML(season.runner_up || "Not announced")}
                </p>

            </div>

        `).join("");

    } catch (error) {

        console.error("Season loading error:", error);

        container.innerHTML = `
            <p class="no-seasons">
                Unable to load season history.
            </p>
        `;

    }

}


/* ==========================================
   11. PLAYER IMAGE PATH
========================================== */

function getPlayerImage(imagePath) {

    if (!imagePath || imagePath === "0") {
        return "./Assets/default-player.png";
    }

    imagePath = String(imagePath).trim();

    if (/^https?:\/\//i.test(imagePath)) {
        return imagePath;
    }

    imagePath = imagePath.replace(/\\/g, "/");
    imagePath = imagePath.replace(/^\/+/, "");
    imagePath = imagePath.replace(/^\.?\//, "");

    return ADMIN_BASE_URL + imagePath;

}


/* ==========================================
   12. DYNAMIC PLAYER SECTION
========================================== */

let aclPlayers = [];

async function loadPlayers() {

    const container = document.getElementById("playersContainer");

    if (!container) return;

    container.innerHTML = "<p>Loading players...</p>";

    try {

        const response = await fetch(PLAYER_API, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Player API error: " + response.status);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Unable to load players");
        }

        aclPlayers = Array.isArray(data.players) ? data.players : [];

        if (aclPlayers.length === 0) {

            container.innerHTML = `
                <p class="no-players">
                    No players available yet.
                </p>
            `;

            return;
        }

        container.innerHTML = aclPlayers.map((player, index) => {

            const image = getPlayerImage(player.image);

            return `

                <div class="player-card" data-player-index="${index}">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(player.name)}"
                        class="player-image"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='./Assets/default-player.png';"
                    >

                    <h3>${escapeHTML(player.name)}</h3>

                    <p>
                        <strong>Team:</strong>
                        ${escapeHTML(player.team_name || "No Team")}
                    </p>

                    <p>
                        <strong>Role:</strong>
                        ${escapeHTML(player.role || "Not specified")}
                    </p>

                    <p>
                        <strong>Jersey:</strong>
                        ${escapeHTML(player.jersey_number ?? "-")}
                    </p>

                    <div class="player-stats">

                        <div>
                            <strong>${escapeHTML(player.matches ?? 0)}</strong>
                            <span>Matches</span>
                        </div>

                        <div>
                            <strong>${escapeHTML(player.runs ?? 0)}</strong>
                            <span>Runs</span>
                        </div>

                        <div>
                            <strong>${escapeHTML(player.wickets ?? 0)}</strong>
                            <span>Wickets</span>
                        </div>

                    </div>

                </div>

            `;

        }).join("");


        container.querySelectorAll(".player-card").forEach(card => {

            card.addEventListener("click", () => {

                const index = Number(card.dataset.playerIndex);
                const player = aclPlayers[index];

                if (player) {
                    openPlayerModal(player);
                }

            });

        });

    } catch (error) {

        console.error("Player loading error:", error);

        container.innerHTML = `
            <p class="no-players">
                Unable to load players.
                Please try again later.
            </p>
        `;

    }

}


/* ==========================================
   13. PLAYER DETAILS MODAL
========================================== */

function openPlayerModal(player) {

    const modal = document.getElementById("teamModal");
    const title = document.getElementById("teamTitle");
    const table = document.getElementById("teamData");
    const summary = document.getElementById("playerSummary");

    if (!modal || !title || !table) return;

    modal.style.display = "flex";

    title.innerText = player.name || "Player Details";

    const image = getPlayerImage(player.image);

    if (summary) {

        summary.innerHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(player.name)}"
                onerror="this.onerror=null;this.src='./Assets/default-player.png';"
                style="
                    width:140px;
                    height:140px;
                    border-radius:50%;
                    object-fit:cover;
                    margin-bottom:10px;
                    border:3px solid #22c55e;
                "
            >

        `;

    }

    table.innerHTML = `

        <tr>
            <th>Field</th>
            <th>Data</th>
        </tr>

        <tr>
            <td>Name</td>
            <td>${escapeHTML(player.name)}</td>
        </tr>

        <tr>
            <td>Age</td>
            <td>${escapeHTML(player.age ?? "-")}</td>
        </tr>

        <tr>
            <td>Team</td>
            <td>${escapeHTML(player.team_name || "No Team")}</td>
        </tr>

        <tr>
            <td>Role</td>
            <td>${escapeHTML(player.role || "-")}</td>
        </tr>

        <tr>
            <td>Jersey Number</td>
            <td>${escapeHTML(player.jersey_number ?? "-")}</td>
        </tr>

        <tr>
            <td>Matches</td>
            <td>${escapeHTML(player.matches ?? 0)}</td>
        </tr>

        <tr>
            <td>Runs</td>
            <td>${escapeHTML(player.runs ?? 0)}</td>
        </tr>

        <tr>
            <td>Wickets</td>
            <td>${escapeHTML(player.wickets ?? 0)}</td>
        </tr>

    `;

}


/* ==========================================
   14. DYNAMIC ORGANIZERS
========================================== */

async function loadOrganizers() {

    const namesContainer = document.getElementById("organizersContainer");
    const mediaContainer = document.getElementById("organizerMediaContainer");

    if (!namesContainer || !mediaContainer) return;

    try {

        const response = await fetch(ORGANIZER_API, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Organizer API error");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Organizer API failed");
        }

        const organizers = Array.isArray(data.organizers) ? data.organizers : [];
        const media = Array.isArray(data.media) ? data.media : [];


        // Organizer names

        if (organizers.length === 0) {

            namesContainer.innerHTML = "<p>No organizers added yet.</p>";

        } else {

            namesContainer.innerHTML = organizers.map(person => `

                <span class="organizer-name">
                    ${escapeHTML(person.name)}
                </span>

            `).join("");

        }


        // Organizer photos and videos

        if (media.length === 0) {

            mediaContainer.innerHTML = "<p>No photos or videos available.</p>";

        } else {

            mediaContainer.innerHTML = media.map(item => {

                const fileUrl = ADMIN_UPLOAD_URL + item.media_path;

                if (item.media_type === "image") {

                    return `

                        <div class="organizer-media">
                            <img
                                src="${escapeHTML(fileUrl)}"
                                alt="ACL Organizer"
                            >
                        </div>

                    `;

                }

                if (item.media_type === "video") {

                    return `

                        <div class="organizer-media video">
                            <video controls>
                                <source src="${escapeHTML(fileUrl)}">
                                Your browser does not support video.
                            </video>
                        </div>

                    `;

                }

                return "";

            }).join("");

        }

    } catch (error) {

        console.error("Organizer loading error:", error);

        namesContainer.innerHTML = "<p>Unable to load organizers.</p>";

        mediaContainer.innerHTML = "<p>Unable to load photos and videos.</p>";

    }

}


/* ==========================================
   15. TOURNAMENT COUNTDOWN
========================================== */

const targetDate = new Date("January 10, 2027 00:00:00").getTime();

function countdown() {

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    const countdownContainer = document.querySelector(".countdown");

    if (!countdownContainer) return;

    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {

        countdownContainer.innerHTML = `
            <h2>🏆 Tournament Started!</h2>
        `;

        return;

    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
    );

    if (daysElement) daysElement.innerText = days;
    if (hoursElement) hoursElement.innerText = hours;
    if (minutesElement) minutesElement.innerText = minutes;
    if (secondsElement) secondsElement.innerText = seconds;

}

countdown();
setInterval(countdown, 1000);


/* ==========================================
   16. INITIALIZE WEBSITE
========================================== */

function initializeACL() {

    loadTeams();
    loadPlayers();
    loadSeasons();
    loadOrganizers();

}

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", initializeACL);

} else {

    initializeACL();

}


/* ==========================================
   END OF ACL MAIN JAVASCRIPT
========================================== */

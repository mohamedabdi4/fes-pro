<!DOCTYPE html>
<html lang="so">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>FES GLOBAL PRO</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0052ad">
    <style>
        :root {
            --bg: #050505; --surface: #121212; --primary: #0052ad;
            --text: #fff; --text-dim: #a1a1aa; --gold: #d4af37; --live: #ff4d4d;
        }

        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding-bottom: 80px; overflow-x: hidden; }

        /* Welcome Modal */
        #welcome-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); display: none; justify-content: center;
            align-items: center; z-index: 10000; padding: 20px; box-sizing: border-box;
        }
        .modal-content {
            background: var(--surface); padding: 30px; border-radius: 25px;
            text-align: center; border: 1px solid var(--primary); max-width: 400px;
        }
        .modal-btn {
            background: var(--primary); color: white; border: none;
            padding: 14px 35px; border-radius: 12px; margin-top: 20px; font-weight: bold; font-size: 16px; cursor: pointer;
        }

        /* Header */
        .header { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; background: var(--surface); border-bottom: 1px solid #222; position: sticky; top: 0; z-index: 100; }
        
        .search-container { padding: 12px 15px; background: var(--bg); position: sticky; top: 60px; z-index: 99; }
        .search-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #333; background: #1a1a1a; color: white; box-sizing: border-box; outline: none; }

        /* Match Cards */
        .match-card { background: var(--surface); margin: 12px; padding: 15px; border-radius: 15px; border: 1px solid #222; transition: 0.3s; }
        .team-row { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; }
        .team-info { display: flex; align-items: center; font-weight: 500; font-size: 14px; }
        .team-logo { width: 22px; height: 22px; object-fit: contain; margin-right: 12px; }
        .score { font-size: 18px; font-weight: 800; color: var(--primary); min-width: 25px; text-align: right; }

        /* Contact Section */
        .contact-card { background: var(--surface); border-radius: 20px; border: 1px solid #222; margin: 15px; padding: 20px; }
        .btn-link { display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 12px; text-decoration: none; color: white; margin-bottom: 10px; font-weight: 600; font-size: 14px; }

        /* Nav Bar */
        .nav-bar { position: fixed; bottom: 0; width: 100%; background: var(--surface); display: flex; justify-content: space-around; padding: 12px 0; border-top: 1px solid #333; }
        .nav-item { color: var(--text-dim); font-size: 11px; text-align: center; text-decoration: none; cursor: pointer; }
        .nav-item.active { color: var(--primary); }
    </style>
</head>
<body>

    <div id="welcome-modal">
        <div class="modal-content">
            <div style="font-size: 50px; margin-bottom: 15px;">⚽</div>
            <h2 id="welcome-title">FES GLOBAL PRO</h2>
            <p id="welcome-text" style="color: var(--text-dim); line-height: 1.6;"></p>
            <button class="modal-btn" onclick="closeWelcome()">BILOW HADDA</button>
        </div>
    </div>

    <header class="header">
        <div style="font-weight: 900; letter-spacing: 2px; font-size: 20px;">FES <span style="color:var(--primary)">PRO</span></div>
        <div style="background: var(--gold); color: black; font-size: 10px; padding: 5px 12px; border-radius: 20px; font-weight: 900;">VIP</div>
    </header>

    <div class="search-container">
        <input type="text" id="searchBar" class="search-input" placeholder="Raadi kooxdaada..." onkeyup="searchLogic()">
    </div>

    <div id="live-matches">
        <p style="text-align:center; padding:50px; color:var(--text-dim);">Loading Secure Data...</p>
    </div>

    <div class="contact-card">
        <h3 style="margin-top:0; font-size:16px; color:var(--primary); text-align: center;">Support & Registration</h3>
        <a href="https://wa.me/252612028724?text=Asc%20FES%20PRO" class="btn-link" style="background:#25D366;">💬 WhatsApp Support</a>
        <a href="tel:+252612028724" class="btn-link" style="background:var(--primary);">📞 Call Now</a>
    </div>

    <nav class="nav-bar">
        <a class="nav-item active">⚽<br>Scores</a>
        <a class="nav-item">🔥<br>News</a>
        <a class="nav-item">👤<br>Profile</a>
    </nav>

    <script>
        const messages = {
            so: { title: "Ku soo dhowow FES PRO!", text: "Natiijooyinka tooska ah iyo wararkii ugu dambeeyay ciyaaraha Soomaaliya iyo Caalamka.", btn: "BILOW HADDA" },
            en: { title: "Welcome to FES PRO!", text: "Get live scores, real-time updates and exclusive football news.", btn: "START NOW" }
        };

        function initApp() {
            const lang = navigator.language.includes('so') ? 'so' : 'en';
            const msg = messages[lang];
            document.getElementById('welcome-title').innerText = msg.title;
            document.getElementById('welcome-text').innerText = msg.text;
            document.querySelector('.modal-btn').innerText = msg.btn;
            if (!localStorage.getItem('fVisited')) document.getElementById('welcome-modal').style.display = 'flex';
            fetchData();
        }

        function closeWelcome() {
            document.getElementById('welcome-modal').style.display = 'none';
            localStorage.setItem('fVisited', 'true');
        }

        const _k = "fba7f33dfce6edbf264c2e0d86395d59"; 
        let allMatches = [];

        async function fetchData() {
            try {
                const r = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {headers:{"x-apisports-key":_k}});
                const d = await r.json();
                if(d.response) {
                    allMatches = d.response;
                    renderMatches(allMatches);
                }
            } catch(e) { 
                document.getElementById('live-matches').innerHTML = "<p style='text-align:center; padding:30px;'>Xogta lama heli karo hadda...</p>";
            }
        }

        function renderMatches(matches) {
            const container = document.getElementById('live-matches');
            if(matches.length > 0) {
                container.innerHTML = matches.map(m => `
                    <div class="match-card">
                        <div style="font-size:10px; color:var(--text-dim); margin-bottom:8px;">${m.league.name} (${m.league.country})</div>
                        <div class="team-row">
                            <div class="team-info"><img src="${m.teams.home.logo}" class="team-logo">${m.teams.home.name}</div>
                            <div class="score">${m.goals.home}</div>
                        </div>
                        <div class="team-row">
                            <div class="team-info"><img src="${m.teams.away.logo}" class="team-logo">${m.teams.away.name}</div>
                            <div class="score">${m.goals.away}</div>
                        </div>
                        <div style="color:var(--live); font-size:11px; text-align:center; margin-top:10px; font-weight:bold;">● LIVE ${m.fixture.status.elapsed}'</div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = "<p style='text-align:center; padding:30px; color:var(--text-dim);'>Ma jiraan ciyaaro hadda socda.</p>";
            }
        }

        // Search Logic Fix
        function searchLogic() {
            const query = document.getElementById('searchBar').value.toLowerCase();
            const filtered = allMatches.filter(m => 
                m.teams.home.name.toLowerCase().includes(query) || 
                m.teams.away.name.toLowerCase().includes(query) ||
                m.league.name.toLowerCase().includes(query)
            );
            renderMatches(filtered);
        }

        window.onload = initApp;
        setInterval(fetchData, 60000); // Is-cusboonaysii daqiiqad walba
    </script>
</body>
</html>


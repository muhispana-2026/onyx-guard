fetch('http://127.0.0.1:3000/api/projects')
    .then(res => res.json())
    .then(projects => {
        if (projects.length === 0) return;
        const activeProjectId = projects[0].id;
        console.log("Active project:", activeProjectId);
        
        fetch('http://127.0.0.1:3000/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
            body: JSON.stringify({ username: "Wargrox", hwid: "HWID-1234-ABCD" })
        }).catch(console.error);

        fetch('http://127.0.0.1:3000/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-project-id': activeProjectId },
            body: JSON.stringify({ username: "AdminServer", hwid: "HWID-9999-XXXX" })
        }).catch(console.error);
    });

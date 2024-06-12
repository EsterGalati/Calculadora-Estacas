document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const welcomePage = document.getElementById('welcome-page');
    const profilePage = document.getElementById('profile-page');
    const calculatorPage = document.getElementById('calculator-page');
    const historyModal = document.getElementById('history-modal');
    const notesModal = document.getElementById('notes-modal');
    const backToCalculatorButtonProfile = document.getElementById('back-to-calculator-button-profile');
    const backToCalculatorButtonHistory = document.getElementById('back-to-calculator-button-history');
    const backToCalculatorButtonNotes = document.getElementById('back-to-calculator-button-notes');

    const categoriaEstaca = document.getElementById('categoriaEstaca');
    const preMoldadaOptions = document.getElementById('preMoldadaOptions');
    const moldadaInLocoOptions = document.getElementById('moldadaInLocoOptions');
    const calcularButton = document.getElementById('calcular-button');
    const exportPdfButton = document.getElementById('exportPdf-button');
    const resultadosDiv = document.getElementById('resultados');
    const metodoCalculo = document.getElementById('metodoCalculo');
    const toggleThemeButton = document.getElementById('toggleTheme-button');

    const addProfileButton = document.getElementById('addProfile-button');
    const updateProfileButton = document.getElementById('updateProfile-button');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const inputContainer = document.getElementById('input-container');
    const profileList = document.getElementById('profileList');
    const currentProfileName = document.getElementById('currentProfileName');
    const editProfileNavButton = document.getElementById('editProfileNav-button');
    const deleteProfileNavButton = document.getElementById('deleteProfileNav-button');
    const viewHistoryNavButton = document.getElementById('viewHistoryNav-button');
    const historyList = document.getElementById('history-list');
    const closeHistoryButton = document.querySelector('.close-button');

    const viewNotesNavButton = document.getElementById('viewNotesNav-button');
    const notesList = document.getElementById('notes-list');
    const newNoteContent = document.getElementById('new-note-content');
    const addNoteButton = document.getElementById('add-note-button');
    const closeNotesButton = document.querySelector('.close-notes-button');

    // Add "Add New Profile" button dynamically
    const addNewProfileButton = document.createElement('button');
    addNewProfileButton.id = 'addNewProfile-button';
    addNewProfileButton.innerText = 'Adicionar Novo Perfil';
    addNewProfileButton.style.display = 'none'; // Hidden by default

    inputContainer.appendChild(addNewProfileButton);

    let profiles = [];
    let currentProfileIndex = null;

    const Ksolo = {
        "Areia": 1000, "Areia siltosa": 800, "Areia siltoargilosa": 700, "Areia Argilosa": 600,
        "Areia argilossiltosa": 500, "Silte": 400, "Silte arenoso": 550, "Silte arenoargiloso": 450,
        "Silte argiloso": 230, "Silte argiloarenoso": 250, "Argila": 200, "Argila arenosa": 350,
        "Argila arenossiltosa": 300, "Argila siltosa": 220, "Argila siltoarenosa": 330
    };

    const asolo = {
        "Areia": 0.014, "Areia siltosa": 0.020, "Areia siltoargilosa": 0.024, "Areia Argilosa": 0.030,
        "Areia argilossiltosa": 0.028, "Silte": 0.030, "Silte arenoso": 0.022, "Silte arenoargiloso": 0.028,
        "Silte argiloso": 0.034, "Silte argiloarenoso": 0.030, "Argila": 0.060, "Argila arenosa": 0.024,
        "Argila arenossiltosa": 0.028, "Argila siltosa": 0.040, "Argila siltoarenosa": 0.030
    };

    const F1Estaca = {
        "Franki": 2.3, "Metalica": 1.8, "Pré-Moldada cravada": 2.5, "Pré-Moldada prensada": 1.2,
        "Escavada pequeno diâmetro": 3.0, "Escavada grande diâmetro": 3.5, "Escavada com lama": 3.5,
        "Raiz": 2.2, "Strauss": 4.2, "Hélice contínua": 3.0
    };

    const F2Estaca = {
        "Franki": 3.0, "Metalica": 3.5, "Pré-Moldada cravada": 3.5, "Pré-Moldada prensada": 2.3,
        "Escavada pequeno diâmetro": 6.0, "Escavada grande diâmetro": 7.0, "Escavada com lama": 4.5,
        "Raiz": 2.4, "Straus": 3.9, "Hélice contínua": 3.8
    };

    categoriaEstaca.addEventListener('change', function () {
        if (categoriaEstaca.value === 'Pré-Moldada') {
            preMoldadaOptions.style.display = 'block';
            moldadaInLocoOptions.style.display = 'none';
        } else {
            preMoldadaOptions.style.display = 'none';
            moldadaInLocoOptions.style.display = 'block';
        }
    });

    function showFeedback(message, type) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `feedback ${type}`;
        feedbackElement.textContent = message;

        // Estilização básica para feedback visual
        feedbackElement.style.position = 'fixed';
        feedbackElement.style.bottom = '20px';
        feedbackElement.style.right = '20px';
        feedbackElement.style.padding = '10px';
        feedbackElement.style.borderRadius = '5px';
        feedbackElement.style.backgroundColor = type === 'success' ? 'green' : 'red';
        feedbackElement.style.color = 'white';
        feedbackElement.style.zIndex = '1000';

        document.body.appendChild(feedbackElement);

        setTimeout(() => {
            feedbackElement.remove();
        }, 3000);
    }

    async function fetchProfiles() {
        try {
            const response = await fetch('http://localhost:3000/api/usuarios');
            profiles = await response.json();
            renderProfiles();
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao carregar perfis.", "error");
        }
    }

    async function fetchHistory(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/historico/${userId}`);
            const history = await response.json();
            renderHistory(history);
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao carregar histórico.", "error");
        }
    }

    async function fetchNotes(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/anotacoes/${userId}`);
            const notes = await response.json();
            renderNotes(notes);
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao carregar anotações.", "error");
        }
    }

    async function calculateResults() {
        if (currentProfileIndex === null || !profiles[currentProfileIndex]) {
            alert("Por favor, selecione um perfil válido.");
            return;
        }

        const tipoSolo = document.getElementById('tipoSolo').value;
        const profundidade = parseFloat(document.getElementById('profundidade').value);
        const nspt = parseFloat(document.getElementById('nspt').value);
        const categoriaEstaca = document.getElementById('categoriaEstaca').value;
        const tipoEstaca = categoriaEstaca === 'Pré-Moldada' ? 
            document.getElementById('tipoPreMoldada').value : 
            document.getElementById('tipoMoldadaInLoco').value;
        const diametroEstaca = parseFloat(document.getElementById('diametroEstaca').value) / 100;
        const metodo = metodoCalculo.value;

        const K = Ksolo[tipoSolo] || 0.0;
        const a = asolo[tipoSolo] || 0.0;
        const F1 = F1Estaca[tipoEstaca] || 0.0;
        const F2 = F2Estaca[tipoEstaca] || 0.0;
        const raio = diametroEstaca / 2;
        const Ap = Math.PI * Math.pow(raio, 2);
        const Al = 2 * Math.PI * raio * profundidade;

        const Rp = ((K * nspt) / F1) * Ap;
        const Rl = (a * ((K * nspt) / F2) * Al) / profundidade;
        const R = Rp + Rl;

        const result = {
            userId: profiles[currentProfileIndex].id,
            tipoSolo,
            profundidade,
            nspt,
            categoriaEstaca,
            tipoEstaca,
            diametroEstaca,
            metodo,
            R: R.toFixed(3),
            Rp: Rp.toFixed(3),
            Rl: Rl.toFixed(3),
            date: new Date().toLocaleString()
        };

        await saveToHistory(result);

        resultadosDiv.innerHTML = `
            <p>Método utilizado: ${metodo}</p>
            <p><strong>R:</strong> ${R.toFixed(3)} Kn</p>
            <p><strong>Rp:</strong> ${Rp.toFixed(3)} Kn</p>
            <p><strong>Rl:</strong> ${Rl.toFixed(3)} Kn</p>
        `;
    }

    async function saveToHistory(result) {
        try {
            const response = await fetch('http://localhost:3000/api/historico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            });

            if (response.ok) {
                showFeedback("Histórico salvo com sucesso!", "success");
                fetchHistory(result.userId); // Recarregar o histórico
            } else {
                showFeedback("Erro ao salvar histórico no servidor.", "error");
            }
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao conectar ao servidor.", "error");
        }
    }

    calcularButton.addEventListener('click', calculateResults);

    async function addNoteButtonHandler() {
        const noteContent = newNoteContent.value.trim();
        if (noteContent) {
            const note = { userId: profiles[currentProfileIndex].id, content: noteContent, date: new Date().toLocaleString() };

            try {
                const response = await fetch('http://localhost:3000/api/anotacoes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(note)
                });

                if (response.ok) {
                    newNoteContent.value = '';
                    fetchNotes(note.userId); // Recarregar as notas
                    showFeedback("Anotação salva com sucesso!", "success");
                } else {
                    showFeedback("Erro ao salvar anotação no servidor.", "error");
                }
            } catch (error) {
                console.error('Erro:', error);
                showFeedback("Erro ao conectar ao servidor.", "error");
            }
        } else {
            alert("Por favor, escreva alguma coisa.");
        }
    }

    addProfileButton.addEventListener('click', async function () {
        const profileName = profileNameInput.value.trim();
        const profileEmail = profileEmailInput.value.trim();
        const profilePhone = profilePhoneInput.value.trim();
        if (profileName && profileEmail && profilePhone) {
            const profile = { name: profileName, email: profileEmail, phone: profilePhone };

            try {
                const response = await fetch('http://localhost:3000/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profile)
                });

                if (response.ok) {
                    profileNameInput.value = '';
                    profileEmailInput.value = '';
                    profilePhoneInput.value = '';
                    fetchProfiles(); // Recarregar os perfis
                    switchToCalculatorPage(profileName);
                    showFeedback("Perfil adicionado com sucesso!", "success");
                } else {
                    showFeedback("Erro ao adicionar perfil.", "error");
                }
            } catch (error) {
                console.error('Erro:', error);
                showFeedback("Erro ao conectar ao servidor.", "error");
            }
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    });

    addNoteButton.addEventListener('click', addNoteButtonHandler);

    function exportResultsToPdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Resultados da Calculadora", 10, 10);
        let y = 20;

        const resultsText = resultadosDiv.innerText.split('\n');
        resultsText.forEach(line => {
            doc.text(line, 10, y);
            y += 10;
        });

        doc.save("resultados.pdf");
    }

    exportPdfButton.addEventListener('click', exportResultsToPdf);

    async function renderProfiles() {
        profileList.innerHTML = '';
        if (profiles.length > 0) {
            profiles.forEach((profile, index) => {
                const profileItem = document.createElement('div');
                profileItem.className = 'profile-item';
                profileItem.innerHTML = `
                    <span>${profile.name}</span>
                    <div>
                        <button onclick="editProfile(${index})">Editar</button>
                        <button onclick="deleteProfile(${index})">Excluir</button>
                        <button onclick="switchProfile(${index})">Selecionar</button>
                    </div>
                `;
                profileList.appendChild(profileItem);
            });
        } else {
            inputContainer.style.display = 'block';
            addProfileButton.style.display = 'inline-block';
        }
    }

    window.editProfile = function (index) {
        currentProfileIndex = index;
        const profile = profiles[index];
        profileNameInput.value = profile.name;
        profileEmailInput.value = profile.email;
        profilePhoneInput.value = profile.phone;
        addProfileButton.style.display = 'none';
        updateProfileButton.style.display = 'inline-block';
        addNewProfileButton.style.display = 'inline-block';
        inputContainer.style.display = 'block';
        profilePage.classList.add('active');
        calculatorPage.classList.remove('active');
        backToCalculatorButtonProfile.style.display = 'inline-block';
    }

    window.deleteProfile = async function (index) {
        const profile = profiles[index];
        const profileId = profile.id;

        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${profileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchProfiles(); // Recarregar os perfis
                showFeedback("Perfil excluído com sucesso!", "success");
            } else {
                showFeedback("Erro ao excluir perfil no servidor.", "error");
            }
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao conectar ao servidor.", "error");
        }
    }

    window.switchProfile = function (index) {
        if (index >= 0 && index < profiles.length) {
            currentProfileIndex = index;
            const profile = profiles[index];
            currentProfileName.textContent = profile.name;
            switchToCalculatorPage(profile.name);
        } else {
            alert("Perfil inválido selecionado.");
        }
    }

    updateProfileButton.addEventListener('click', async function () {
        const profileName = profileNameInput.value.trim();
        const profileEmail = profileEmailInput.value.trim();
        const profilePhone = profilePhoneInput.value.trim();
        if (profileName && profileEmail && profilePhone && currentProfileIndex !== null) {
            const profile = profiles[currentProfileIndex];
            const updatedProfile = { ...profile, name: profileName, email: profileEmail, phone: profilePhone };

            try {
                const response = await fetch(`http://localhost:3000/api/usuarios/${profile.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedProfile)
                });

                if (response.ok) {
                    profileNameInput.value = '';
                    profileEmailInput.value = '';
                    profilePhoneInput.value = '';
                    currentProfileIndex = null;
                    fetchProfiles(); // Recarregar os perfis
                    showFeedback("Perfil atualizado com sucesso!", "success");
                } else {
                    showFeedback("Erro ao atualizar perfil.", "error");
                }
            } catch (error) {
                console.error('Erro:', error);
                showFeedback("Erro ao conectar ao servidor.", "error");
            }
        }
    });

    addNewProfileButton.addEventListener('click', function () {
        inputContainer.style.display = 'block';
        updateProfileButton.style.display = 'none';
        addProfileButton.style.display = 'inline-block';
        profileNameInput.value = '';
        profileEmailInput.value = '';
        profilePhoneInput.value = '';
    });

    editProfileNavButton.addEventListener('click', function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            const profile = profiles[currentProfileIndex];
            profileNameInput.value = profile.name;
            profileEmailInput.value = profile.email;
            profilePhoneInput.value = profile.phone;
            updateProfileButton.style.display = 'inline-block';
            addProfileButton.style.display = 'none';
            addNewProfileButton.style.display = 'inline-block';
            inputContainer.style.display = 'block';
            switchToProfilePage();
            backToCalculatorButtonProfile.style.display = 'inline-block';
        }
    });

    deleteProfileNavButton.addEventListener('click', async function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            const profile = profiles[currentProfileIndex];
            const profileId = profile.id;

            try {
                const response = await fetch(`http://localhost:3000/api/usuarios/${profileId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchProfiles(); // Recarregar os perfis
                    showFeedback("Perfil excluído com sucesso!", "success");
                } else {
                    showFeedback("Erro ao excluir perfil no servidor.", "error");
                }
            } catch (error) {
                console.error('Erro:', error);
                showFeedback("Erro ao conectar ao servidor.", "error");
            }
        }
    });

    viewHistoryNavButton.addEventListener('click', function () {
        const currentProfile = profiles[currentProfileIndex];
        if (currentProfile) {
            fetchHistory(currentProfile.id);
            historyModal.style.display = 'block';
        } else {
            showFeedback("Nenhum perfil selecionado.", "error");
        }
    });

    closeHistoryButton.addEventListener('click', function () {
        historyModal.style.display = 'none';
    });

    function renderHistory(history) {
        historyList.innerHTML = '';
        if (history.length > 0) {
            history.forEach((entry, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <span>Data: ${entry.date}</span>
                    <span>Tipo de Solo: ${entry.tipoSolo}</span>
                    <span>Profundidade: ${entry.profundidade} m</span>
                    <span>Nspt: ${entry.nspt}</span>
                    <span>Categoria da Estaca: ${entry.categoriaEstaca}</span>
                    <span>Tipo de Estaca: ${entry.tipoEstaca}</span>
                    <span>Diâmetro da Estaca: ${entry.diametroEstaca * 100} cm</span>
                    <span>Método: ${entry.metodo}</span>
                    <span><strong>R:</strong> ${entry.R} Kn</span>
                    <span><strong>Rp:</strong> ${entry.Rp} Kn</span>
                    <span><strong>Rl:</strong> ${entry.Rl} Kn</span>
                    <button onclick="deleteHistoryEntry(${index}, ${entry.id})">Excluir</button>
                `;
                historyList.appendChild(historyItem);
            });
        } else {
            historyList.innerHTML = '<p>Nenhum histórico encontrado.</p>';
        }
    }

    window.deleteHistoryEntry = async function (index, entryId) {
        try {
            const response = await fetch(`http://localhost:3000/api/historico/${entryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const currentProfile = profiles[currentProfileIndex];
                if (currentProfile) {
                    fetchHistory(currentProfile.id); // Recarregar o histórico
                    showFeedback("Histórico excluído com sucesso!", "success");
                }
            } else {
                showFeedback("Erro ao excluir histórico no servidor.", "error");
            }
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao conectar ao servidor.", "error");
        }
    }

    viewNotesNavButton.addEventListener('click', function () {
        const currentProfile = profiles[currentProfileIndex];
        if (currentProfile) {
            fetchNotes(currentProfile.id);
            notesModal.style.display = 'block';
        } else {
            showFeedback("Nenhum perfil selecionado.", "error");
        }
    });

    closeNotesButton.addEventListener('click', function () {
        notesModal.style.display = 'none';
    });

    function renderNotes(notes) {
        notesList.innerHTML = '';
        if (notes.length > 0) {
            notes.forEach((note, index) => {
                const noteItem = document.createElement('div');
                noteItem.className = 'note-item';
                noteItem.innerHTML = `
                    <span>${note.date}</span>
                    <span>${note.content}</span>
                    <button onclick="editNoteEntry(${index}, ${note.id})">Editar</button>
                    <button onclick="deleteNoteEntry(${index}, ${note.id})">Excluir</button>
                `;
                notesList.appendChild(noteItem);
            });
        } else {
            notesList.innerHTML = '<p>Nenhuma anotação encontrada.</p>';
        }
    }

    window.editNoteEntry = function (index, noteId) {
        const noteContent = prompt("Edite sua anotação:", notes[index].content);
        if (noteContent !== null && noteContent.trim() !== "") {
            const updatedNote = { ...notes[index], content: noteContent.trim(), date: new Date().toLocaleString() };

            fetch(`http://localhost:3000/api/anotacoes/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedNote)
            }).then(response => {
                if (response.ok) {
                    fetchNotes(profiles[currentProfileIndex].id); // Recarregar as notas
                    showFeedback("Anotação atualizada com sucesso!", "success");
                } else {
                    showFeedback("Erro ao atualizar anotação.", "error");
                }
            }).catch(error => {
                console.error('Erro:', error);
                showFeedback("Erro ao conectar ao servidor.", "error");
            });
        }
    };

    window.deleteNoteEntry = async function (index, noteId) {
        try {
            const response = await fetch(`http://localhost:3000/api/anotacoes/${noteId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchNotes(profiles[currentProfileIndex].id); // Recarregar as notas
                showFeedback("Anotação excluída com sucesso!", "success");
            } else {
                showFeedback("Erro ao excluir anotação no servidor.", "error");
            }
        } catch (error) {
            console.error('Erro:', error);
            showFeedback("Erro ao conectar ao servidor.", "error");
        }
    }

    function switchToCalculatorPage(profileName) {
        if (profileName) {
            const profile = profiles.find(profile => profile.name === profileName);
            if (profile) {
                currentProfileName.textContent = profileName;
                profileNameInput.value = profile.name;
                profileEmailInput.value = profile.email;
                profilePhoneInput.value = profile.phone;
            }
        }
        welcomePage.classList.remove('active');
        profilePage.classList.remove('active');
        calculatorPage.classList.add('active');
        backToCalculatorButtonProfile.style.display = 'none';
        addNewProfileButton.style.display = 'none'; 
    }

    function switchToProfilePage() {
        profileNameInput.value = '';
        profileEmailInput.value = '';
        profilePhoneInput.value = '';
        inputContainer.style.display = 'block';
        currentProfileIndex = null;
        if (profiles.length === 0) {
            addProfileButton.style.display = 'inline-block';
        } else {
            addProfileButton.style.display = 'none';
        }
        updateProfileButton.style.display = 'none';
        addNewProfileButton.style.display = 'none';
        welcomePage.classList.remove('active');
        profilePage.classList.add('active');
        calculatorPage.classList.remove('active');
        backToCalculatorButtonProfile.style.display = 'none';
    }

    startButton.addEventListener('click', function() {
        fetchProfiles().then(() => {
            if (profiles.length > 0) {
                switchProfile(0);
            } else {
                switchToProfilePage();
            }
        });
    });

    backToCalculatorButtonProfile.addEventListener('click', function() {
        switchToCalculatorPage(currentProfileName.textContent);
    });

    backToCalculatorButtonHistory.addEventListener('click', function() {
        historyModal.style.display = 'none';
        switchToCalculatorPage(currentProfileName.textContent);
    });

    backToCalculatorButtonNotes.addEventListener('click', function () {
        notesModal.style.display = 'none';
        switchToCalculatorPage(currentProfileName.textContent);
    });

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    toggleThemeButton.addEventListener('click', toggleTheme);

    loadTheme();
});

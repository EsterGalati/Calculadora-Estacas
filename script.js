document.addEventListener('DOMContentLoaded', function () {
    const categoriaEstaca = document.getElementById('categoriaEstaca');
    const preMoldadaOptions = document.getElementById('preMoldadaOptions');
    const moldadaInLocoOptions = document.getElementById('moldadaInLocoOptions');
    const calcularButton = document.getElementById('calcular-button');
    const resultadosDiv = document.getElementById('resultados');
    const metodoCalculo = document.getElementById('metodoCalculo');

    const addProfileButton = document.getElementById('addProfile-button');
    const updateProfileButton = document.getElementById('updateProfile-button');
    const cancelEditButton = document.getElementById('cancelEdit-button');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhone');
    const profileList = document.getElementById('profileList');
    const profilePage = document.getElementById('profile-page');
    const calculatorPage = document.getElementById('calculator-page');
    const currentProfileName = document.getElementById('currentProfileName');
    const editProfileNavButton = document.getElementById('editProfileNav-button');
    const deleteProfileNavButton = document.getElementById('deleteProfileNav-button');
    const backToCalculatorButton = document.getElementById('backToCalculator-button');

    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    let currentProfileIndex = profiles.length > 0 ? 0 : null;

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

    function calculateResults() {
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

        resultadosDiv.innerHTML = `
            <p>Método utilizado: ${metodo}</p>
            <p><strong>R:</strong> ${R.toFixed(3)} Kn</p>
            <p><strong>Rp:</strong> ${Rp.toFixed(3)} Kn</p>
            <p><strong>Rl:</strong> ${Rl.toFixed(3)} Kn</p>
        `;
    }

    calcularButton.addEventListener('click', calculateResults);

    function renderProfiles() {
        profileList.innerHTML = '';
        if (profiles.length > 0) {
            const profile = profiles[0];
            const profileItem = document.createElement('div');
            profileItem.className = 'profile-item';
            profileItem.innerHTML = `
                <span>${profile.name}</span>
                <div>
                    <button onclick="editProfile(0)">Editar</button>
                    <button onclick="deleteProfile(0)">Excluir</button>
                </div>
            `;
            profileList.appendChild(profileItem);
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
        cancelEditButton.style.display = 'inline-block';
        profilePage.classList.add('active');
        calculatorPage.classList.remove('active');
    }

    window.deleteProfile = function (index) {
        profiles.splice(index, 1);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        renderProfiles();
        switchToProfilePage();
    }

    addProfileButton.addEventListener('click', function () {
        if (profiles.length === 0) {
            const profileName = profileNameInput.value.trim();
            const profileEmail = profileEmailInput.value.trim();
            const profilePhone = profilePhoneInput.value.trim();
            if (profileName && profileEmail && profilePhone) {
                profiles = [{ name: profileName, email: profileEmail, phone: profilePhone }];
                localStorage.setItem('profiles', JSON.stringify(profiles));
                profileNameInput.value = '';
                profileEmailInput.value = '';
                profilePhoneInput.value = '';
                renderProfiles();
                switchToCalculatorPage(profileName);
            }
        } else {
            alert("Você só pode adicionar um perfil. Exclua o perfil existente antes de adicionar um novo.");
        }
    });

    updateProfileButton.addEventListener('click', function () {
        const profileName = profileNameInput.value.trim();
        const profileEmail = profileEmailInput.value.trim();
        const profilePhone = profilePhoneInput.value.trim();
        if (profileName && profileEmail && profilePhone && currentProfileIndex !== null) {
            profiles[currentProfileIndex] = { name: profileName, email: profileEmail, phone: profilePhone };
            localStorage.setItem('profiles', JSON.stringify(profiles));
            profileNameInput.value = '';
            profileEmailInput.value = '';
            profilePhoneInput.value = '';
            currentProfileIndex = null;
            addProfileButton.style.display = 'inline-block';
            updateProfileButton.style.display = 'none';
            cancelEditButton.style.display = 'none';
            renderProfiles();
            switchToCalculatorPage(profileName);
        }
    });

    cancelEditButton.addEventListener('click', function () {
        switchToProfilePage();
    });

    editProfileNavButton.addEventListener('click', function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            const profile = profiles[currentProfileIndex];
            profileNameInput.value = profile.name;
            profileEmailInput.value = profile.email;
            profilePhoneInput.value = profile.phone;
            switchToProfilePage();
        }
    });

    deleteProfileNavButton.addEventListener('click', function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            profiles.splice(currentProfileIndex, 1);
            localStorage.setItem('profiles', JSON.stringify(profiles));
            renderProfiles();
            switchToProfilePage();
        }
    });

    backToCalculatorButton.addEventListener('click', function () {
        if (profiles.length > 0) {
            switchToCalculatorPage(profiles[0].name);
        } else {
            switchToCalculatorPage('');
        }
    });

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
        profilePage.classList.remove('active');
        calculatorPage.classList.add('active');
    }

    function switchToProfilePage() {
        profileNameInput.value = '';
        profileEmailInput.value = '';
        profilePhoneInput.value = '';
        currentProfileIndex = null;
        addProfileButton.style.display = 'inline-block';
        updateProfileButton.style.display = 'none';
        cancelEditButton.style.display = 'none';
        profilePage.classList.add('active');
        calculatorPage.classList.remove('active');
    }

    renderProfiles();

    if (profiles.length > 0) {
        switchToCalculatorPage(profiles[0].name);
    }
});

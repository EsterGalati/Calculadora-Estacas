document.addEventListener('DOMContentLoaded', function () {
    const categoriaEstaca = document.getElementById('categoriaEstaca');
    const preMoldadaOptions = document.getElementById('preMoldadaOptions');
    const moldadaInLocoOptions = document.getElementById('moldadaInLocoOptions');
    const calcularButton = document.getElementById('calcular-button');
    const resultadosDiv = document.getElementById('resultados');
    const metodoCalculo = document.getElementById('metodoCalculo');

    const addProfileButton = document.getElementById('addProfile-button');
    const updateProfileButton = document.getElementById('updateProfile-button');
    const profileNameInput = document.getElementById('profileName');
    const profileList = document.getElementById('profileList');
    const profileSection = document.getElementById('profile-section');
    const calculatorSection = document.getElementById('calculator-section');
    const currentProfileName = document.getElementById('currentProfileName');
    const editProfileNavButton = document.getElementById('editProfileNav-button');
    const deleteProfileNavButton = document.getElementById('deleteProfileNav-button');

    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    let currentProfileIndex = null;

    const Ksolo = { /* Valores de Ksolo... */ };
    const asolo = { /* Valores de asolo... */ };
    const F1Estaca = { /* Valores de F1Estaca... */ };
    const F2Estaca = { /* Valores de F2Estaca... */ };

    function renderProfiles() {
        profileList.innerHTML = '';
        profiles.forEach((profile, index) => {
            const profileItem = document.createElement('div');
            profileItem.className = 'profile-item';
            profileItem.innerHTML = `
                <span>${profile.name}</span>
                <div>
                    <button onclick="editProfile(${index})">Editar</button>
                    <button onclick="deleteProfile(${index})">Excluir</button>
                </div>
            `;
            profileList.appendChild(profileItem);
        });
    }

    window.editProfile = function (index) {
        currentProfileIndex = index;
        profileNameInput.value = profiles[index].name;
        addProfileButton.style.display = 'none';
        updateProfileButton.style.display = 'inline-block';
    }

    window.deleteProfile = function (index) {
        profiles.splice(index, 1);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        renderProfiles();
    }

    addProfileButton.addEventListener('click', function () {
        const profileName = profileNameInput.value.trim();
        if (profileName) {
            profiles.push({ name: profileName });
            localStorage.setItem('profiles', JSON.stringify(profiles));
            profileNameInput.value = '';
            renderProfiles();
            switchToCalculatorSection(profileName);
        }
    });

    updateProfileButton.addEventListener('click', function () {
        const profileName = profileNameInput.value.trim();
        if (profileName && currentProfileIndex !== null) {
            profiles[currentProfileIndex].name = profileName;
            localStorage.setItem('profiles', JSON.stringify(profiles));
            profileNameInput.value = '';
            currentProfileIndex = null;
            addProfileButton.style.display = 'inline-block';
            updateProfileButton.style.display = 'none';
            renderProfiles();
        }
    });

    editProfileNavButton.addEventListener('click', function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            profileNameInput.value = profiles[currentProfileIndex].name;
            profileSection.classList.add('active');
            calculatorSection.classList.remove('active');
            addProfileButton.style.display = 'none';
            updateProfileButton.style.display = 'inline-block';
        }
    });

    deleteProfileNavButton.addEventListener('click', function () {
        currentProfileIndex = profiles.findIndex(profile => profile.name === currentProfileName.textContent);
        if (currentProfileIndex !== -1) {
            profiles.splice(currentProfileIndex, 1);
            localStorage.setItem('profiles', JSON.stringify(profiles));
            renderProfiles();
            switchToProfileSection();
        }
    });

    function switchToCalculatorSection(profileName) {
        currentProfileName.textContent
        currentProfileName.textContent = profileName;
        profileSection.classList.remove('active');
        calculatorSection.classList.add('active');
    }

    function switchToProfileSection() {
        profileSection.classList.add('active');
        calculatorSection.classList.remove('active');
    }

    // Render profiles on page load
    renderProfiles();

    // Mostrar opções de estaca conforme a categoria selecionada
    categoriaEstaca.addEventListener('change', function () {
        if (this.value === 'Pré-Moldada') {
            preMoldadaOptions.style.display = 'block';
            moldadaInLocoOptions.style.display = 'none';
        } else {
            preMoldadaOptions.style.display = 'none';
            moldadaInLocoOptions.style.display = 'block';
        }
    });

    // Cálculo do método Aoki e Decourt
    calcularButton.addEventListener('click', function () {
        const tipoSolo = document.getElementById('tipoSolo').value;
        const profundidade = parseFloat(document.getElementById('profundidade').value);
        const nspt = parseFloat(document.getElementById('nspt').value);
        const diametroEstaca = parseFloat(document.getElementById('diametroEstaca').value);
        const tipoEstaca = categoriaEstaca.value === 'Pré-Moldada' ? document.getElementById('tipoPreMoldada').value : document.getElementById('tipoMoldadaInLoco').value;
        const metodo = metodoCalculo.value;

        const areaEstaca = Math.PI * Math.pow(diametroEstaca / 2, 2);
        const perimetroEstaca = Math.PI * diametroEstaca;

        const K = Ksolo[tipoSolo];
        const a = asolo[tipoSolo];
        const F1 = F1Estaca[tipoEstaca];
        const F2 = F2Estaca[tipoEstaca];

        let Rp, Rl;

        if (metodo === 'Aoki') {
            Rp = K * nspt * areaEstaca / 100;
            Rl = a * nspt * perimetroEstaca * profundidade / 100;
        } else if (metodo === 'Decourt') {
            Rp = F1 * nspt * areaEstaca / 100;
            Rl = F2 * nspt * perimetroEstaca * profundidade / 100;
        }

        const R = Rp + Rl;

        resultadosDiv.innerHTML = `
            <p><strong>Tipo de Solo:</strong> ${tipoSolo}</p>
            <p><strong>Profundidade:</strong> ${profundidade} m</p>
            <p><strong>NSPT:</strong> ${nspt}</p>
            <p><strong>Diâmetro da Estaca:</strong> ${diametroEstaca} cm</p>
            <p><strong>Tipo de Estaca:</strong> ${tipoEstaca}</p>
            <p><strong>Método de Cálculo:</strong> ${metodo}</p>
            <p><strong>Área da Estaca:</strong> ${areaEstaca.toFixed(2)} cm²</p>
            <p><strong>Perímetro da Estaca:</strong> ${perimetroEstaca.toFixed(2)} cm</p>
            <p><strong>Resistência da Ponta (Rp):</strong> ${Rp.toFixed(2)} kN</p>
            <p><strong>Resistência Lateral (Rl):</strong> ${Rl.toFixed(2)} kN</p>
            <p><strong>Resistência Total (R):</strong> ${R.toFixed(2)} kN</p>
        `;
    });
});

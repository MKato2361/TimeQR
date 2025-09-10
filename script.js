// script.js
document.addEventListener('DOMContentLoaded', () => {
    const mainScreen = document.getElementById('main-screen');
    const qrDisplay = document.getElementById('qr-display');
    const settingsScreen = document.getElementById('settings-screen');
    const qr1Btn = document.getElementById('qr1-btn');
    const qr2Btn = document.getElementById('qr2-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const backBtn = document.getElementById('back-btn');
    const saveBtn = document.getElementById('save-btn');
    const qr1LabelInput = document.getElementById('qr1-label');
    const qr1ContentInput = document.getElementById('qr1-content');
    const qr2LabelInput = document.getElementById('qr2-label');
    const qr2ContentInput = document.getElementById('qr2-content');
    const qrCodeDiv = document.getElementById('qr-code');

    let qrData = loadSettings();

    updateButtons();

    qr1Btn.addEventListener('click', () => showQR(qrData.qr1.content));
    qr2Btn.addEventListener('click', () => showQR(qrData.qr2.content));
    settingsBtn.addEventListener('click', showSettings);
    backBtn.addEventListener('click', showMain);
    saveBtn.addEventListener('click', saveSettings);

    function showQR(content) {
        if (!content) return;
        qrCodeDiv.innerHTML = '';
        new QRCode(qrCodeDiv, {
            text: content,
            width: 256,
            height: 256,
            colorDark: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#000000',
            colorLight: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#000000' : '#ffffff'
        });
        mainScreen.classList.add('hidden');
        qrDisplay.classList.remove('hidden');
    }

    function showSettings() {
        qr1LabelInput.value = qrData.qr1.label;
        qr1ContentInput.value = qrData.qr1.content;
        qr2LabelInput.value = qrData.qr2.label;
        qr2ContentInput.value = qrData.qr2.content;
        mainScreen.classList.add('hidden');
        settingsScreen.classList.remove('hidden');
    }

    function showMain() {
        qrDisplay.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    }

    function saveSettings() {
        qrData = {
            qr1: {
                label: qr1LabelInput.value || 'QR1',
                content: qr1ContentInput.value || ''
            },
            qr2: {
                label: qr2LabelInput.value || 'QR2',
                content: qr2ContentInput.value || ''
            }
        };
        localStorage.setItem('qrAppSettings', JSON.stringify(qrData));
        updateButtons();
        showMain();
    }

    function updateButtons() {
        qr1Btn.textContent = qrData.qr1.label;
        qr2Btn.textContent = qrData.qr2.label;
    }

    function loadSettings() {
        const saved = localStorage.getItem('qrAppSettings');
        return saved ? JSON.parse(saved) : {
            qr1: { label: 'QR1', content: '' },
            qr2: { label: 'QR2', content: '' }
        };
    }

    // ダークモード変更時にQRコードを更新（表示中のみ）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!qrDisplay.classList.contains('hidden')) {
            const currentContent = qrCodeDiv.querySelector('canvas') ? qrCodeDiv.querySelector('canvas').toDataURL() : ''; // 簡易的に再生成
            showQR(currentContent); // 実際の内容で再生成が必要
        }
    });
});

(function () {
    // Config: ถ้าต้องการใช้ Google Sheets ให้ใส่ sheetId และ gid แล้วเปลี่ยน useGoogleSheet = true
    const useGoogleSheet = false; // set true to enable
    const sheetId = 'YOUR_SHEET_ID_HERE';
    const gid = '0';

    const sampleData = [
        ['ปีการศึกษา 2567', 'MUS101', 'พื้นฐานดนตรี', '3', '2/1'],
        ['ปีการศึกษา 2567', 'MUS102', 'ดนตรีไทยพื้นฐาน', '3', '1/2'],
        ['ปีการศึกษา 2567', 'MUS201', 'การสอนดนตรีในโรงเรียน', '3', '2/1']
    ];

    const tableBody = document.querySelector('#courses-table tbody');
    const selectTerm = document.getElementById('select-term');

    function clearTable() { tableBody.innerHTML = ''; }
    function addRow(row) {
        const tr = document.createElement('tr');
        row.forEach(col => {
            const td = document.createElement('td'); td.textContent = col; tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    }

    function populateTerms(data) {
        // data: array of arrays, first col assumed to be term
        const terms = [...new Set(data.map(r => r[0] || 'ไม่ระบุ'))];
        selectTerm.innerHTML = '<option value="all">ทั้งหมด</option>' + terms.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    function renderData(data) {
        clearTable();
        const selected = selectTerm.value || 'all';
        data.forEach(row => {
            if (selected === 'all' || row[0] === selected) addRow(row);
        });
    }

    selectTerm.addEventListener('change', () => { if (window._loadedData) renderData(window._loadedData); });

    function parseCSV(csv) {
        const lines = csv.trim().split(/\r?\n/).map(l => l.split(',').map(c => c.trim()));
        return lines;
    }

    function fetchSheetCSV(id, gid) {
        const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
        return fetch(url).then(r => {
            if (!r.ok) throw new Error('ไม่สามารถโหลด Google Sheet ได้: ' + r.status);
            return r.text();
        });
    }

    function init() {
        if (useGoogleSheet && sheetId) {
            fetchSheetCSV(sheetId, gid).then(txt => {
                const data = parseCSV(txt);
                window._loadedData = data;
                populateTerms(data);
                renderData(data);
            }).catch(err => {
                console.warn(err);
                window._loadedData = sampleData;
                populateTerms(sampleData);
                renderData(sampleData);
            });
        } else {
            window._loadedData = sampleData;
            populateTerms(sampleData);
            renderData(sampleData);
        }

        // contact form
        const form = document.getElementById('contact-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const msg = document.getElementById('contact-message').value.trim();
            // Note: this demo does not send email. For real email, integrate with Formspree / Netlify Forms / server endpoint
            document.getElementById('contact-feedback').textContent = 'ขอบคุณ ' + name + '! ข้อความของคุณถูกบันทึก (ตัวอย่าง)';
            form.reset();
        });

        // simple mobile menu
        const menuToggle = document.getElementById('menu-toggle');
        menuToggle.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            if (nav.style.display === 'flex') nav.style.display = 'none'; else nav.style.display = 'flex';
        });

        // smooth scrolling for nav links
        document.querySelectorAll('.nav-link').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const id = a.getAttribute('href').slice(1);
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (window.innerWidth <= 720) document.querySelector('.nav').style.display = 'none';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
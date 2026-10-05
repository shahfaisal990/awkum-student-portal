// ==========================================================================
// Student Portal Interactive Scripts - eservices.awkum.edu.pk
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  initDeviceSwitcher();
  initClock();
});

// 1. Sidebar Toggle Drawer
function initSidebar() {
  const sidebar = document.getElementById('sidebarDrawer');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Close sidebar on link click
  const menuLinks = document.querySelectorAll('.sidebar-nav a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.forEach(l => l.parentElement.classList.remove('active'));
      link.parentElement.classList.add('active');
      closeSidebar();
    });
  });
}

// 2. Navigation Tabs (Activity, Result, Fee History)
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button, .nav-tab-btn');
  const tabContents = {
    tabActivity: document.getElementById('tabActivity'),
    tabResult: document.getElementById('tabResult'),
    tabFee: document.getElementById('tabFee')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all contents and show target
      Object.values(tabContents).forEach(content => {
        if (content) content.style.display = 'none';
      });

      if (tabContents[targetId]) {
        tabContents[targetId].style.display = 'block';
      }
    });
  });
}

// 3. Desktop Switcher Mode (Phone Frame vs Full Width)
function initDeviceSwitcher() {
  const container = document.getElementById('mobileContainer');
  const btnPhone = document.getElementById('btnPhoneView');
  const btnFull = document.getElementById('btnFullView');

  if (!btnPhone || !btnFull || !container) return;

  btnPhone.addEventListener('click', () => {
    container.classList.remove('full-view');
    btnPhone.classList.add('active');
    btnFull.classList.remove('active');
    showToast('Switched to Phone Frame View');
  });

  btnFull.addEventListener('click', () => {
    container.classList.add('full-view');
    btnFull.classList.add('active');
    btnPhone.classList.remove('active');
    showToast('Switched to Full Width View');
  });
}

// 4. Greeting Timestamp (Matches exact 2-line wrapped format from screenshot)
function initClock() {
  const timeElem = document.getElementById('liveTimestamp');
  if (!timeElem) return;

  function update() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');

    timeElem.innerHTML = `<div>(Today is ${dayName}, ${monthName} ${dateNum}, ${year}</div><div>${hoursStr}:${minutes} ${ampm} PKT)</div>`;
  }

  update();
  setInterval(update, 60000);
}

// 5. Course Actions: Toggle + or X
function toggleCourse(courseIndex, courseName) {
  const row = document.getElementById(`rowCourse${courseIndex}`);
  if (!row) return;

  const btn = row.querySelector('.btn-blue-action, .btn-table-action');
  if (!btn) return;

  if (btn.textContent.trim() === '+') {
    if (confirm(`Do you want to mark "${courseName}" for dropping/exclusion?`)) {
      btn.textContent = '✕';
      btn.classList.add('removed');
      btn.title = 'Click to re-assign subject';
      row.style.opacity = '0.55';
      showToast(`Subject marked as X (Excluded)`);
    }
  } else {
    btn.textContent = '+';
    btn.classList.remove('removed');
    btn.title = 'Toggle subject';
    row.style.opacity = '1';
    showToast(`Subject re-included`);
  }
}

// 6. Student Profile "More Details" Toggle
let detailsExpanded = false;
function toggleMoreDetails() {
  const extraDetails = document.getElementById('extraStudentDetails');
  const btn = document.getElementById('btnMoreDetails');

  if (!extraDetails || !btn) return;

  detailsExpanded = !detailsExpanded;
  if (detailsExpanded) {
    extraDetails.style.display = 'block';
    btn.textContent = 'Less Details';
  } else {
    extraDetails.style.display = 'none';
    btn.textContent = 'More Details';
  }
}

// 7. Download Official E-Registration Card
function downloadRegistrationCard() {
  const btn = document.getElementById('btnDownloadCard');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `⏳ Downloading...`;
  }

  setTimeout(() => {
    const slipContent = `=====================================================
ABDUL WALI KHAN UNIVERSITY MARDAN (AWKUM)
OFFICIAL E-REGISTRATION CARD & SINGLE SLIP - 7th SEMESTER
=====================================================
Student Name : Muhammad Abdullah
Father Name  : Muhammad Ilyas
Reg. No      : AWKUM-231003762
Discipline   : BSCS - Artificial Intelligence
Semester     : 7th Semester (Section B)
Campus       : Garden Campus
Status       : InProgress
Fee Status   : Receipt Verified
Date Issued  : ${new Date().toLocaleDateString()}
=====================================================
This is a system generated document and does not 
require signature.
=====================================================`;

    const blob = new Blob([slipContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AWKUM_ERegistration_Single_Slip_231003762.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="white" style="vertical-align: -1px; margin-right: 3px;">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
        </svg>
        Download`;
    }

    showToast('Official E-Registration Card & Single Slip downloaded successfully!');
  }, 750);
}

// 8. Modals Management
function openModal(title, htmlBody) {
  const modal = document.getElementById('portalModal');
  const titleElem = document.getElementById('modalTitle');
  const bodyElem = document.getElementById('modalBody');

  if (modal && titleElem && bodyElem) {
    titleElem.textContent = title;
    bodyElem.innerHTML = htmlBody;
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('portalModal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (e) => {
  const modal = document.getElementById('portalModal');
  if (e.target === modal) {
    closeModal();
  }
});

function openResetPasswordModal() {
  const html = `
    <div>
      <p style="margin-bottom:8px;">Enter your student registration number or institutional email to reset your portal password:</p>
      <input type="text" value="AWKUM-231003762" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:3px; font-size:12px; margin-bottom:10px;">
      <button style="background:#337ab7; color:white; border:none; padding:6px 12px; border-radius:3px; cursor:pointer;" onclick="showToast('Password OTP sent to your registered phone number.'); closeModal();">Send OTP</button>
    </div>
  `;
  openModal('Reset Account Password', html);
}

function showInstructionToast() {
  const html = `
    <div style="font-size:11.5px; line-height:1.5;">
      <h5 style="color:#d9534f; margin-bottom:6px;">⚠️ E-Service Ease Guidelines:</h5>
      <ul style="padding-left:16px;">
        <li>All student card and clearance forms require departmental endorsement.</li>
        <li>Challan payments take 24-48 hours to reflect on the online portal.</li>
        <li>For fee discrepancies, contact Treasurer Cell (+92-937-920860).</li>
      </ul>
    </div>
  `;
  openModal('Instruction (Eservice Ease)', html);
}

function triggerDownloadsList() {
  const html = `
    <div style="font-size:11.5px;">
      <ul style="list-style:none; padding:0;">
        <li style="padding:6px 0; border-bottom:1px solid #eee;">📄 <a href="javascript:void(0)" style="color:#337ab7; font-weight:600;" onclick="showToast('Downloading AI Syllabus...')">BSCS AI Scheme of Studies (PDF)</a></li>
        <li style="padding:6px 0; border-bottom:1px solid #eee;">📄 <a href="javascript:void(0)" style="color:#337ab7; font-weight:600;" onclick="showToast('Downloading Calendar...')">Academic Calendar 2026-27 (PDF)</a></li>
        <li style="padding:6px 0;">📄 <a href="javascript:void(0)" style="color:#337ab7; font-weight:600;" onclick="downloadRegistrationCard(); closeModal();">Official E-Registration Card (Slip)</a></li>
      </ul>
    </div>
  `;
  openModal('Portal Downloads', html);
}

function showPaymentInfo(method) {
  const html = `
    <div style="font-size:11.5px; line-height:1.5;">
      <div style="background:#fef9e7; padding:8px; border-left:3px solid #f39c12; margin-bottom:8px;">
        <strong>Challan Receipt No:</strong> 4177222213900604<br>
        <strong>Payable Amount:</strong> PKR 66,000.00
      </div>
      <p>How to pay using <strong>${method}</strong>:</p>
      <ol style="padding-left:16px; margin-top:5px;">
        <li>Open your <strong>${method}</strong> mobile application.</li>
        <li>Go to <em>Bill Payment &gt; Education / University</em>.</li>
        <li>Choose <strong>Abdul Wali Khan University Mardan</strong>.</li>
        <li>Enter 16-digit voucher: <code>4177222213900604</code>.</li>
        <li>Verify student name <strong>Muhammad Abdullah</strong> and submit.</li>
      </ol>
    </div>
  `;
  openModal(`Pay via ${method}`, html);
}

function openEserviceModal(serviceName) {
  const html = `
    <div style="font-size:11.5px; line-height:1.5;">
      <p>Service: <strong>${serviceName}</strong></p>
      <p style="margin-top:6px; color:#555;">Your request will be submitted to the Admissions and Examination Directorate.</p>
      <div style="margin-top:10px;">
        <button style="background:#00c0ef; color:white; border:none; padding:6px 12px; border-radius:3px; cursor:pointer;" onclick="showToast('Application for ${serviceName} initiated successfully!'); closeModal();">Submit Application</button>
      </div>
    </div>
  `;
  openModal(serviceName, html);
}

// 9. Toast Helper
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('portalToast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

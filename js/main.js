/**
 * Bluebay Holidays - Interactive UI Handlers & shadcn Dialogs
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_PHONE = '917736849886';

  /* ==========================================================================
     1. NAVBAR SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navCapsule = document.querySelector('.nav-pill-capsule');

  if (mobileToggle && navCapsule) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navCapsule.classList.toggle('mobile-open');
    });

    navCapsule.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          navCapsule.classList.remove('mobile-open');
        }
      });
    });

    // Close menu when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (navCapsule.classList.contains('mobile-open') && !navCapsule.contains(e.target) && !mobileToggle.contains(e.target)) {
        navCapsule.classList.remove('mobile-open');
      }
    });
  }

  /* ==========================================================================
     3. SHADCN DIALOG / MODAL SYSTEM
     ========================================================================== */
  const dialogBtns = document.querySelectorAll('.open-dialog-btn');
  const dialogOverlays = document.querySelectorAll('.dialog-overlay');
  const staySelect = document.getElementById('dialogStaySelect');

  dialogBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-dialog');
      const presetStay = btn.getAttribute('data-preset');

      // If preset stay is specified (e.g. from a stay card "Get a Quote")
      if (presetStay && staySelect) {
        // match select option
        for (let i = 0; i < staySelect.options.length; i++) {
          if (staySelect.options[i].value.toLowerCase().includes(presetStay.toLowerCase())) {
            staySelect.selectedIndex = i;
            break;
          }
        }
      }

      const targetDialog = document.getElementById(targetId);
      if (targetDialog) {
        targetDialog.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  document.querySelectorAll('.dialog-close-btn').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      dialogOverlays.forEach(d => d.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  dialogOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Escape key to close dialog
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dialogOverlays.forEach(d => d.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });

  /* ==========================================================================
     4. DIALOG ENQUIRY FORM TO WHATSAPP & TRAVELER STEPPER
     ========================================================================== */
  // Stepper state
  let adultsCount = 2;
  let childrenCount = 0;

  const btnAdultMinus = document.getElementById('btnAdultMinus');
  const btnAdultPlus = document.getElementById('btnAdultPlus');
  const valAdults = document.getElementById('valAdults');

  const btnChildMinus = document.getElementById('btnChildMinus');
  const btnChildPlus = document.getElementById('btnChildPlus');
  const valChildren = document.getElementById('valChildren');

  if (btnAdultMinus && btnAdultPlus && valAdults) {
    btnAdultMinus.addEventListener('click', () => {
      if (adultsCount > 1) {
        adultsCount--;
        valAdults.textContent = adultsCount;
      }
    });

    btnAdultPlus.addEventListener('click', () => {
      if (adultsCount < 20) {
        adultsCount++;
        valAdults.textContent = adultsCount;
      }
    });
  }

  if (btnChildMinus && btnChildPlus && valChildren) {
    btnChildMinus.addEventListener('click', () => {
      if (childrenCount > 0) {
        childrenCount--;
        valChildren.textContent = childrenCount;
      }
    });

    btnChildPlus.addEventListener('click', () => {
      if (childrenCount < 15) {
        childrenCount++;
        valChildren.textContent = childrenCount;
      }
    });
  }

  // Arrival and Return Date picker listeners with dynamic duration calculation
  const arrivalInput = document.getElementById('dialogArrivalDate');
  const returnInput = document.getElementById('dialogReturnDate');
  const durationNote = document.getElementById('dialogTripDurationNote');
  const durationText = document.getElementById('dialogTripDurationText');

  if (arrivalInput && returnInput) {
    const today = new Date().toISOString().split('T')[0];
    arrivalInput.min = today;

    const updateDuration = () => {
      if (arrivalInput.value) {
        returnInput.min = arrivalInput.value;
      }
      if (arrivalInput.value && returnInput.value) {
        const arrDate = new Date(arrivalInput.value + 'T00:00:00');
        const retDate = new Date(returnInput.value + 'T00:00:00');
        const diffMs = retDate - arrDate;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && durationNote && durationText) {
          const nights = diffDays;
          const days = diffDays + 1;
          durationText.textContent = `${nights} Night${nights === 1 ? '' : 's'} / ${days} Day${days === 1 ? '' : 's'}`;
          durationNote.style.display = 'inline-flex';
        } else if (durationNote) {
          durationNote.style.display = 'none';
        }
      } else if (durationNote) {
        durationNote.style.display = 'none';
      }
    };

    arrivalInput.addEventListener('change', () => {
      if (returnInput.value && returnInput.value < arrivalInput.value) {
        returnInput.value = arrivalInput.value;
      }
      updateDuration();
    });

    returnInput.addEventListener('change', updateDuration);
  }

  // Format date helper: YYYY-MM-DD -> DD MMM YYYY (e.g. 15 Dec 2026)
  const formatDateStr = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const enquiryForm = document.getElementById('dialogEnquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('dialogGuestName')?.value.trim() || 'Guest';
      const guestPhone = document.getElementById('dialogGuestPhone')?.value.trim() || '';
      const stay = document.getElementById('dialogStaySelect')?.value || 'Not selected';
      const arrivalVal = arrivalInput?.value || '';
      const returnVal = returnInput?.value || '';

      // Collect checked add-ons
      const checkedBoxes = Array.from(document.querySelectorAll('input[name="dialogAddons"]:checked'))
        .map(cb => cb.value);
      const addonsText = checkedBoxes.length > 0 ? checkedBoxes.join(', ') : 'None selected';

      // Traveler breakdown
      const totalGuests = adultsCount + childrenCount;
      let travelersSummary = `${adultsCount} Above 10 Years`;
      if (childrenCount > 0) {
        travelersSummary += `, ${childrenCount} Under 10 Years`;
      }
      travelersSummary += ` (Total: ${totalGuests} Travelers)`;

      // Calculate trip duration
      let tripDurationStr = '';
      if (arrivalVal && returnVal) {
        const arrDate = new Date(arrivalVal + 'T00:00:00');
        const retDate = new Date(returnVal + 'T00:00:00');
        const diffMs = retDate - arrDate;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          tripDurationStr = `${diffDays} Night${diffDays === 1 ? '' : 's'} / ${diffDays + 1} Day${diffDays === 1 ? '' : 's'}`;
        }
      }

      // Clean, Plain Text WhatsApp Message (no symbols, asterisks, or broken emojis)
      let message = `New Trip Enquiry - Bluebay Holidays\n\n` +
        `Guest Name: ${guestName}\n` +
        (guestPhone ? `Contact: ${guestPhone}\n` : '') +
        `Stay Package: ${stay}\n` +
        `Travelers: ${travelersSummary}\n`;

      if (arrivalVal && returnVal) {
        message += `Arrival Date: ${formatDateStr(arrivalVal)}\n` +
          `Return Date: ${formatDateStr(returnVal)}\n` +
          (tripDurationStr ? `Trip Duration: ${tripDurationStr}\n` : '');
      } else if (arrivalVal) {
        message += `Arrival Date: ${formatDateStr(arrivalVal)}\n`;
      }

      message += `Add-on Interests: ${addonsText}\n\n` +
        `Please share detailed package itinerary, pricing and entry permit guidelines!`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');

      // Close modal
      const enquireDialog = document.getElementById('enquireDialog');
      if (enquireDialog) {
        enquireDialog.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     5. GALLERY FILTERING & LIGHTBOX
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mainGridItems = document.querySelectorAll('.gallery-grid-main .gallery-item');
  const allGalleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSub = document.getElementById('lightboxSub');

  // Filter category buttons (only filters the archive grid)
  if (filterBtns.length > 0 && mainGridItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        mainGridItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox open for all gallery items (both exhibition cards and archive grid)
  if (allGalleryItems.length > 0 && lightbox && lightboxImg) {
    allGalleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        const title = item.getAttribute('data-title');
        const sub = item.getAttribute('data-sub');

        if (imgSrc) {
          lightboxImg.src = imgSrc;
          if (lightboxTitle) lightboxTitle.textContent = title || '';
          if (lightboxSub) lightboxSub.textContent = sub || '';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Interactive exhibition number index switcher
  const indexNums = document.querySelectorAll('.index-num');
  if (indexNums.length > 0) {
    indexNums.forEach(num => {
      num.addEventListener('click', () => {
        indexNums.forEach(n => n.classList.remove('active'));
        num.classList.add('active');
        const slot = parseInt(num.getAttribute('data-index'), 10);
        if (slot) {
          const targetCard = document.querySelector(`.polaroid-card[data-slot="${slot}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.boxShadow = '0 0 0 3px #0284c7, 0 20px 40px rgba(2, 132, 199, 0.35)';
            setTimeout(() => {
              targetCard.style.boxShadow = '';
            }, 1800);
          }
        }
      });
    });
  }
});


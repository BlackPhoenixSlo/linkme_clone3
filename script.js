document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = {
        name: document.getElementById('displayName'),
        bio: document.getElementById('bio'),
        avatar: document.getElementById('avatar'),
        verifiedBadge: document.getElementById('verifiedBadge')
    };
    const linksContainer = document.getElementById('linksContainer');
    const overlay = document.getElementById('overlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const continueBtn = document.getElementById('continueBtn');

    // Store links data to simulate API fetching
    let linksData = [];
    let currentLinkId = null;

    // Helper: Perform Bounce
    function performBounce(targetUrl) {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const isInstagram = ua.indexOf('Instagram') > -1;
        const isIOS = /iPhone|iPad|iPod/.test(ua);
        const isAndroid = /Android/.test(ua);

        console.log(`Attempting bounce to: ${targetUrl}`);

        if (isInstagram) {
            if (isIOS) {
                const bounceUrl = "x-safari-https://" + targetUrl.replace(/^https?:\/\//, "");
                window.location.href = bounceUrl;
                return true;
            } else if (isAndroid) {
                const intentUrl = "intent://" + targetUrl.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end";
                window.location.href = intentUrl;
                return true;
            }
        }

        // Fallback / Standard Redirect
        window.location.href = targetUrl;
        return false;
    }

    // Fetch data from "API"
    // In production this would be /api/profile
    fetch('api/profile.json')
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            linksData = data.links;
            renderLinks(linksData);

            // Check for Deep Link Query Param
            // Example: /?link=1 (where 1 is the link ID)
            const urlParams = new URLSearchParams(window.location.search);
            const deepLinkParam = urlParams.get('link');

            if (deepLinkParam) {
                // Find link by ID
                const link = linksData.find(l => l.id === deepLinkParam);
                if (link && link.realUrl) {
                    console.log('Deep link detected, bouncing...');
                    // Simulate slight delay for "API" to resolve if it were real
                    setTimeout(() => performBounce(link.realUrl), 100);
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    function renderProfile(profile) {
        profileContainer.name.textContent = profile.displayName;
        profileContainer.bio.textContent = profile.bio;
        profileContainer.avatar.src = profile.avatarUrl;

        if (profile.verified) {
            profileContainer.verifiedBadge.style.display = 'inline-block';
        }
    }

    function renderLinks(links) {
        linksContainer.innerHTML = '';
        links.forEach(link => {
            const card = document.createElement('div');
            card.className = 'link-card';

            // Thumbnail
            if (link.thumbnailUrl) { // Using placehold.co images from JSON if available
                const img = document.createElement('img');
                img.src = link.thumbnailUrl || 'https://via.placeholder.com/50';
                img.className = 'link-thumbnail';
                card.appendChild(img);
            }

            const content = document.createElement('div');
            content.className = 'link-content';

            const title = document.createElement('span');
            title.className = 'link-title';
            title.textContent = link.title;

            // Add lock icon to title if adult
            if (link.isAdult) {
                const lockIcon = document.createElement('i');
                lockIcon.className = 'fas fa-lock lock-icon-small';
                title.appendChild(lockIcon);
            }

            const subtitle = document.createElement('span');
            subtitle.className = 'link-subtitle';
            subtitle.textContent = link.subtitle || (link.isAdult ? 'Exclusive Content' : 'Social Media');

            content.appendChild(title);
            content.appendChild(subtitle);
            card.appendChild(content);

            // Click Handler
            card.addEventListener('click', () => {
                if (link.isAdult) {
                    openOverlay(link.id);
                } else {
                    window.location.href = link.url;
                }
            });

            linksContainer.appendChild(card);
        });
    }

    // Overlay Logic
    function openOverlay(linkId) {
        currentLinkId = linkId;
        overlay.classList.remove('hidden');
        // Add active class for transition
        setTimeout(() => overlay.classList.add('active'), 10);
    }

    function closeOverlay() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
        currentLinkId = null;
    }

    closeOverlayBtn.addEventListener('click', closeOverlay);

    // Deep Linking / Bounce Logic
    continueBtn.addEventListener('click', () => {
        if (!currentLinkId) return;

        // Simulate API fetch to get the real URL
        // In reality, this would be: fetch(`/api/getLink?id=${currentLinkId}`)
        const link = linksData.find(l => l.id === currentLinkId);

        if (link && link.realUrl) {
            continueBtn.textContent = 'loading...';
            continueBtn.disabled = true;

            // Simulate network delay
            setTimeout(() => {
                performBounce(link.realUrl);

                // Reset UI (in case user comes back)
                continueBtn.textContent = 'Continue (18+)';
                continueBtn.disabled = false;
                closeOverlay();
            }, 800);
        }
    });

    // Close on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
});

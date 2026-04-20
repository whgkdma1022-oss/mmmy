document.addEventListener('DOMContentLoaded', () => {
    // Board Elements
    const boardForm = document.getElementById('board-submit');
    const boardCancel = document.getElementById('board-cancel');
    const boardList = document.getElementById('board-list');
    const boardDownload = document.getElementById('board-download');
    const nameInput = document.getElementById('board-name');
    const titleInput = document.getElementById('board-title');
    const contentInput = document.getElementById('board-content');
    const postIdInput = document.getElementById('post-id');
    const formTitle = document.getElementById('form-title');
    const totalPostsSpan = document.getElementById('total-posts');

    // Contact Form Elements
    const contactForm = document.getElementById('contact-form');

    // Initial Data - More unique key to prevent collisions
    const STORAGE_KEY = 'johaeum-portfolio-v2-posts';
    let posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        renderPosts();
    }

    function renderPosts() {
        if (!boardList) return;
        boardList.innerHTML = '';
        totalPostsSpan.textContent = posts.length;

        // Sort by date/id descending
        [...posts].sort((a, b) => b.id - a.id).forEach(post => {
            const div = document.createElement('div');
            div.className = 'board-item animate-up';
            const likes = post.likes || 0;
            div.innerHTML = `
                <div class="post-header">
                    <div>
                        <div class="post-title">${escapeHtml(post.title)}</div>
                        <div class="post-info">${escapeHtml(post.name)} | ${post.date}</div>
                    </div>
                    <div class="post-recommend">
                        <button class="recommend-btn" onclick="recommendPost(${post.id})">
                            <i class="fas fa-thumbs-up"></i> 추천 <span>${likes}</span>
                        </button>
                    </div>
                </div>
                <div class="post-content">${escapeHtml(post.content)}</div>
                <div class="post-actions">
                    <button class="action-btn" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button class="action-btn delete" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </div>
            `;
            boardList.appendChild(div);
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Recommend Function
    window.recommendPost = (id) => {
        const post = posts.find(p => p.id === id);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            saveToStorage();
        }
    };

    // Backup Function
    if (boardDownload) {
        boardDownload.addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href",     dataStr);
            downloadAnchorNode.setAttribute("download", "portfolio_board_backup.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    // Global action functions
    window.deletePost = (id) => {
        if(confirm('정말 삭제하시겠습니까?')) {
            posts = posts.filter(p => p.id !== id);
            saveToStorage();
        }
    };

    window.editPost = (id) => {
        const post = posts.find(p => p.id === id);
        if(post) {
            postIdInput.value = post.id;
            nameInput.value = post.name;
            titleInput.value = post.title;
            contentInput.value = post.content;
            
            formTitle.textContent = '글 수정하기';
            boardForm.textContent = '수정 완료';
            boardCancel.style.display = 'block';
            
            document.getElementById('board-form-wrapper').scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (boardCancel) boardCancel.addEventListener('click', resetForm);

    function resetForm() {
        postIdInput.value = '';
        nameInput.value = '';
        titleInput.value = '';
        contentInput.value = '';
        if (formTitle) formTitle.textContent = '새 글 쓰기';
        if (boardForm) boardForm.textContent = '등록하기';
        if (boardCancel) boardCancel.style.display = 'none';
    }

    if (boardForm) {
        boardForm.addEventListener('click', () => {
            const id = postIdInput.value;
            const name = nameInput.value.trim();
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const date = new Date().toLocaleDateString();

            if (name && title && content) {
                if(id) {
                    const index = posts.findIndex(p => p.id == id);
                    posts[index] = { ...posts[index], name, title, content };
                    alert('글이 수정되었습니다.');
                } else {
                    const newPost = {
                        id: Date.now(),
                        name,
                        title,
                        content,
                        date
                    };
                    posts.push(newPost);
                    alert('글이 등록되었습니다.');
                }
                
                saveToStorage();
                resetForm();
            } else {
                alert('모든 필드를 입력해주세요.');
            }
        });
    }

    // Contact Form Logic
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('contact-name');
            const emailEl = document.getElementById('contact-email');
            const messageEl = document.getElementById('contact-message');
            
            if (!nameEl || !emailEl || !messageEl) return;

            const name = nameEl.value;
            const email = emailEl.value;
            const message = messageEl.value;
            const subject = `[Portfolio Inquiry] From ${name}`;

            // Construct mailto link
            const mailtoLink = `mailto:whgkdma5@dongyang.ac.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + message)}`;
            
            // Open mail client
            window.location.href = mailtoLink;
        });
    }

    // Modal Logic
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.modal-close');

    window.openModal = (container) => {
        const img = container.querySelector('img');
        if (modal && modalImg) {
            modal.style.display = "block";
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    };

    if (closeModal) {
        closeModal.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        };
    }

    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = 'auto';
            }
        };
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    renderPosts();

    // Navigation & Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});


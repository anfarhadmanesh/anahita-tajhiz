window.onscroll = function() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  var myBar = document.getElementById("myBar");
  if (myBar) { myBar.style.width = scrolled + "%"; }
};

function toggleFaqSection(btn) {
  btn.classList.toggle('active');
  var content = btn.nextElementSibling;
  if (content.style.display === "none" || content.style.display === "") {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", function() {

  document.querySelectorAll('.faq-question').forEach(function(question) {
    question.addEventListener('click', function() {
      var answer = question.nextElementSibling;
      var isActive = question.classList.contains('active');
      
      document.querySelectorAll('.faq-question').forEach(function(q) { q.classList.remove('active'); });
      document.querySelectorAll('.faq-answer').forEach(function(a) { a.classList.remove('active'); });
      
      if (!isActive) {
        question.classList.add('active');
        answer.classList.add('active');
      }
    });
  });

  const submitBtn = document.getElementById('submit-comment-btn');
  const commentsList = document.getElementById('comments-list');
  
  if (submitBtn && commentsList) {
    const articleId = window.location.pathname; 
    let savedComments = JSON.parse(localStorage.getItem('comments_' + articleId)) || [];

    function renderComments() {
      if (savedComments.length === 0) {
        commentsList.innerHTML = '<p style="color:#6b7280; font-size:14px;">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>';
        return;
      }
      commentsList.innerHTML = savedComments.map(function(c) {
        return '<div class="comment-item">' +
          '<div class="comment-header">' +
            '<span class="comment-name">' + c.name + '</span>' +
            '<span class="comment-stars">' + '★'.repeat(c.rating) + '☆'.repeat(5 - c.rating) + '</span>' +
          '</div>' +
          '<p class="comment-text">' + c.text + '</p>' +
        '</div>';
      }).join('');
    }

    submitBtn.addEventListener('click', function() {
      const name = document.getElementById('comment-name').value;
      const text = document.getElementById('comment-text').value;
      const ratingInput = document.querySelector('input[name="rating"]:checked');
      
      if (!ratingInput) {
        alert('لطفاً به مقاله امتیاز دهید (روی ستاره‌ها کلیک کنید).');
        return;
      }
      if (!name || !text) {
        alert('لطفاً نام و متن نظر خود را وارد کنید.');
        return;
      }

      const newComment = { name: name, text: text, rating: parseInt(ratingInput.value) };
      savedComments.push(newComment);
      localStorage.setItem('comments_' + articleId, JSON.stringify(savedComments));
      
      document.getElementById('comment-form').reset();
      renderComments();
      
      const oldMsg = document.getElementById('thank-you-msg');
      if (oldMsg) oldMsg.remove();

      const thankYouMsg = document.createElement('div');
      thankYouMsg.id = 'thank-you-msg';
      thankYouMsg.innerHTML = '✅ نظر شما با موفقیت ثبت شد. سپاسگزاریم! 🌹';
      thankYouMsg.style.cssText = 'background: #ecfdf5; color: #065f46; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold;';
      
      commentsList.parentNode.insertBefore(thankYouMsg, commentsList);
      setTimeout(function() { thankYouMsg.remove(); }, 4000);
    });
    
    renderComments(); 
  }
});
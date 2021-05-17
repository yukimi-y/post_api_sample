// Rails API 側の ベースURL
const baseURL = 'http://localhost:3000';
// 投稿リストの DOM 要素オブジェクトを取得
const postList = document.getElementById('post-list');

// Rails の API から投稿一覧データを取得する関数
const fetchPosts = async () => {
  // ローカルの Rails サーバーの URL
  const url = `${baseURL}/posts`;
  const response = await fetch(url);

  // レスポンスが 200 OK 以外ならエラーを発生
  if (!response.ok) {
    throw new Error(`${response.status} (${response.statusText})`);
  }

  // レスポンスが 200 OK なら JSON を抽出
  const posts = await response.json();
  return posts;
};

// 投稿データを投稿リストに反映する関数
const addPost = (post) => {
  const content = `
  <div id="posts-${post.id}">
    <p>タイトル: ${post.title}</p>
    <p>内容: ${post.content}</p>
  </div>
  `;
  postList.insertAdjacentHTML('beforeend', content);
};

// Rails の API から投稿一覧データを取得してページに表示する関数
const displayPosts = async () => {
  try {
    // 投稿一覧データを取得
    const posts = await fetchPosts();
    // 各投稿を投稿リストに追加
    posts.forEach((post) => addPost(post));
  } catch (e) {
    alert(e);
  }
};

// 起動時に投稿一覧表示
displayPosts();
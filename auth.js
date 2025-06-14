const SUPABASE_URL = "https://cdkuwlmddbvgahadowwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNka3V3bG1kZGJ2Z2FoYWRvd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTIzMTIsImV4cCI6MjA2MzE2ODMxMn0.z8M2fgghS59tJ16IxW97Jvq9uEg4NOBaZWov8iri7BY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const PLACEHOLDER_IMG = 'images/profile-placeholder.svg';

// Username helpers
async function getUsername(userId) {
  const { data, error } = await supabase
    .from('usernames')
    .select('username')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return data.username;
}

async function isUsernameAvailable(username) {
  if (!username) return false;
  const { data } = await supabase
    .from('usernames')
    .select('id')
    .eq('username', username)
    .single();
  return !data;
}

async function setUsername(userId, username) {
  const available = await isUsernameAvailable(username);
  if (!available) return { error: 'unavailable' };
  const { error } = await supabase
    .from('usernames')
    .upsert({ id: userId, username });
  return { error };
}

async function getAvatarUrl(userId) {
  const { data: files, error: listError } = await supabase.storage
    .from('avatars')
    .list('', { search: userId });
  if (!listError && files.some((f) => f.name === userId)) {
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(userId, 60);
    if (data && !error) {
      return data.signedUrl;
    }
  }
  return PLACEHOLDER_IMG;
}

async function updateUserStatus() {
  const { data: { session } } = await supabase.auth.getSession();
  const container = document.getElementById("userStatus");
  if (!container) return;
  if (session && session.user) {
    const avatarUrl = await getAvatarUrl(session.user.id);
    const username = await getUsername(session.user.id);
    const displayName = username || session.user.email;
    container.innerHTML = `
      <div class="dropdown" style="text-align:center;">
        <img src="${avatarUrl}" alt="Profile" class="avatar">
        <a href="profile.html" id="userName">${displayName}</a>
        <div class="dropdown-content">
          <a href="profile.html">Profile</a>
          <a href="settings.html">Settings</a>
          <a href="track-order.html">Track Your Order</a>
          <a href="#" id="logoutLink">Log Out</a>
        </div>
      </div>`;
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.reload();
      });
    }
  } else {
    // Display a placeholder avatar with the login link when the user is not logged in
    container.innerHTML = `
      <div class="dropdown" style="text-align:center;">
        <img src="${PLACEHOLDER_IMG}" alt="Profile" class="avatar">
        <a href="login.html" id="loginLink">Log In</a>
        <div class="dropdown-content">
          <a href="profile.html">Profile</a>
          <a href="settings.html">Settings</a>
          <a href="track-order.html">Track Your Order</a>
          <a href="login.html">Log In</a>
        </div>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await updateUserStatus();
  supabase.auth.onAuthStateChange(() => updateUserStatus());
});

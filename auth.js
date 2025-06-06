const SUPABASE_URL = "https://cdkuwlmddbvgahadowwz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNka3V3bG1kZGJ2Z2FoYWRvd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTIzMTIsImV4cCI6MjA2MzE2ODMxMn0.z8M2fgghS59tJ16IxW97Jvq9uEg4NOBaZWov8iri7BY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateUserStatus() {
  const { data: { session } } = await supabase.auth.getSession();
  const container = document.getElementById("userStatus");
  if (!container) return;
  if (session && session.user) {
    container.innerHTML = `
      <div class="dropdown">
        <a href="profile.html" id="userName">${session.user.email}</a>
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
    container.innerHTML = `
      <div class="dropdown">
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

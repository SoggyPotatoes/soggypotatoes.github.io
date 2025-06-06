const SUPABASE_URL = 'https://cdkuwlmddbvgahadowwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNka3V3bG1kZGJ2Z2FoYWRvd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTIzMTIsImV4cCI6MjA2MzE2ODMxMn0.z8M2fgghS59tJ16IxW97Jvq9uEg4NOBaZWov8iri7BY';

// Create a single Supabase client for the entire app
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  if (data && data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data.user;
}

async function updateUserStatus() {
  let user = null;
  const saved = localStorage.getItem('user');
  if (saved) {
    try {
      user = JSON.parse(saved);
    } catch (err) {
      localStorage.removeItem('user');
    }
  }

  if (!user) {
    const { data } = await supabase.auth.getSession();
    user = data?.session?.user || null;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  const container = document.getElementById('userStatus');
  if (container) {
    if (user) {
      container.innerHTML = `<a href="profile.html">${user.email}</a>`;
    } else {
      container.innerHTML = '<a href="login.html">Login</a>';
    }
  }
}

window.loginUser = loginUser;
window.updateUserStatus = updateUserStatus;

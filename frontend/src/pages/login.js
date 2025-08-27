(function () {
  const loginForm = document.getElementById("loginForm");
  const errorSpan = document.getElementById("formError");
  const adminView = document.getElementById("adminView");
  const userView = document.getElementById("userView");
  const loginContainer = document.getElementById("loginContainer");
  const usersList = document.getElementById("usersList");
  const btnLoadUsers = document.getElementById("btnLoadUsers");
  const mainView = document.getElementById("mainView");
  const userInfo = document.getElementById("userInfo");
  // SPA Perfiles elements
  const profilesView = document.getElementById("profilesView");
  const navPerfiles = document.getElementById("navPerfiles");
  const navPerfiles2 = document.getElementById("navPerfiles2");
  const navInicio = document.getElementById("navInicio");
  const profilesBtnCrear = document.getElementById("profilesBtnCrear");
  const profilesWhoami = document.getElementById("profilesWhoami");
  const userModal = document.getElementById("userModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const createUserForm = document.getElementById("createUserForm");
  const createUserError = document.getElementById("createUserError");

  const API_BASE = "http://localhost:3000";

  function showMain(user) {
    loginContainer.style.display = "none";
    adminView && (adminView.style.display = "none");
    userView && (userView.style.display = "none");
    profilesView && (profilesView.style.display = "none");
    if (mainView) {
      mainView.style.display = "block";
    }
    if (user && userInfo) {
      userInfo.textContent = `${user.email} (${user.role})`;
    }
  }

  function createProfileCard(u) {
    const card = document.createElement("div");
    card.className = "perfil";
    card.innerHTML = `
      <div class="foto"><img src="https://via.placeholder.com/80" alt="Foto de perfil" /></div>
      <div class="info"><h3>${u.name || "Sin nombre"}</h3><p>${
      u.cohort || ""
    }</p></div>
      <div class="etiquetas"><span>${(
        u.schedule || ""
      ).toUpperCase()}</span><span>${u.english_level || ""}</span><span>${
      u.role || ""
    }</span></div>
    `;
    return card;
  }

  async function showProfiles() {
    // Ocultar otras vistas y mostrar perfiles
    mainView && (mainView.style.display = "none");
    adminView && (adminView.style.display = "none");
    userView && (userView.style.display = "none");
    loginContainer.style.display = "none";
    if (profilesView) {
      profilesView.style.display = "block";
    }

    // Cargar sesión y rol
    try {
      const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
      if (!res.ok) {
        // volver al login si no hay sesión
        mainView && (mainView.style.display = "none");
        profilesView && (profilesView.style.display = "none");
        loginContainer.style.display = "block";
        return;
      }
      const data = await res.json();
      const user = data && data.user ? data.user : null;
      if (user) {
        profilesWhoami &&
          (profilesWhoami.textContent = `${user.email} (${user.role})`);
        // Mostrar/ocultar botón crear según rol
        if (user.role === "admin") {
          profilesBtnCrear && (profilesBtnCrear.style.display = "inline-block");
          // Abrir modal al pulsar crear
          if (profilesBtnCrear && userModal) {
            profilesBtnCrear.onclick = () => {
              userModal.style.display = "flex";
            };
          } 
        } else {
          profilesBtnCrear && (profilesBtnCrear.style.display = "none");
        }
        // Cerrar modal
        if (btnCloseModal && userModal) {
          btnCloseModal.onclick = () => {
            userModal.style.display = "none";
          };
        }
        // Envío de formulario crear usuario (solo admin)
        if (createUserForm) {
          createUserForm.onsubmit = async (ev) => {
            ev.preventDefault();
            if (!user || user.role !== "admin") {
              return;
            }
            createUserError && (createUserError.textContent = "");
            const form = new FormData(createUserForm);
            const payload = Object.fromEntries(form.entries());
            try {
              const resCreate = await fetch(`${API_BASE}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
              });
              if (!resCreate.ok) {
                const err = await resCreate
                  .json()
                  .catch(() => ({ message: "Error al crear" }));
                throw new Error(err.message || "Error al crear");
              }
              // Recargar tarjetas
              const resUsers = await fetch(`${API_BASE}/users`, {
                credentials: "include",
              });
              if (resUsers.ok) {
                const users = await resUsers.json();
                const grid = document.getElementById("profilesGrid");
                if (grid) {
                  grid.innerHTML = "";
                  (users || []).forEach((u) =>
                    grid.appendChild(createProfileCard(u))
                  );
                }
              }
              userModal && (userModal.style.display = "none");
              createUserForm.reset();
            } catch (e) {
              createUserError &&
                (createUserError.textContent = e.message || "Error");
            }
          };
        }
        // Cargar usuarios y pintarlos para cualquier rol autenticado
        try {
          const resUsers = await fetch(`${API_BASE}/users`, {
            credentials: "include",
          });
          if (resUsers.ok) {
            const users = await resUsers.json();
            const grid = document.getElementById("profilesGrid");
            if (grid) {
              grid.innerHTML = "";
              (users || []).forEach((u) =>
                grid.appendChild(createProfileCard(u))
              );
            }
          }
        } catch (e) {
          /* silenciar */
        }
      }
    } catch (e) {
      // si falla, regresar al login
      mainView && (mainView.style.display = "none");
      profilesView && (profilesView.style.display = "none");
      loginContainer.style.display = "block";
    }
  }

  function renderUsers(users) {
    usersList.innerHTML = "";
    (users || []).forEach((u) => {
      const li = document.createElement("li");
      li.style.padding = "6px 0";
      li.textContent = `${u.id} | ${u.name || u.username || ""} | ${
        u.email || ""
      } | ${u.role || ""}`;
      usersList.appendChild(li);
    });
  }

  async function loadUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      renderUsers(data);
    } catch (err) {
      alert("No se pudieron cargar los usuarios");
    }
  }

  if (btnLoadUsers) {
    btnLoadUsers.addEventListener("click", loadUsers);
  }

  // Eventos de navegación SPA
  if (navPerfiles) {
    navPerfiles.addEventListener("click", function (e) {
      e.preventDefault();
      showProfiles();
    });
  }
  if (navPerfiles2) {
    navPerfiles2.addEventListener("click", function (e) {
      e.preventDefault();
      showProfiles();
    });
  }
  if (navInicio) {
    navInicio.addEventListener("click", function (e) {
      e.preventDefault();
      showMain();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = this.email.value.trim();
      const password = this.password.value.trim();
      if (!email || !password) {
        errorSpan.textContent = "Por favor ingresa email y contraseña.";
        return;
      }
      errorSpan.textContent = "";

      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Credenciales inválidas");
        }

        // Usar directamente la respuesta de /login para mostrar la vista principal (evita llamada extra a /me)
        showMain(data.user);
      } catch (err) {
        errorSpan.textContent = err.message || "Error de conexión";
      }
    });
  }
})();

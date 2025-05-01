function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

async function loadClients() {
  const response = await fetch('/clients');
  const clients = await response.json();
  const tbody = document.getElementById('clients-table');
  tbody.innerHTML = '';
  
  clients.forEach(client => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${client.id}</td>
          <td>${client.nom}</td>
          <td>${client.prenom}</td>
          <td>${client.email}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

async function searchClients() {
  const term = document.getElementById('client-search').value;
  const response = await fetch(`/clients/search?term=${encodeURIComponent(term)}`);
  const clients = await response.json();
  const tbody = document.getElementById('clients-table');
  tbody.innerHTML = '';
  
  clients.forEach(client => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${client.id}</td>
          <td>${client.nom}</td>
          <td>${client.prenom}</td>
          <td>${client.email}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

async function deleteClient(id) {
  if (confirm('Supprimer ce client ?')) {
      await fetch(`/clients/${id}`, {method: 'DELETE'});
      loadClients();
  }
}


async function loadProduits() {
  const response = await fetch('/produits');
  const produits = await response.json();
  const tbody = document.getElementById('produits-table');
  tbody.innerHTML = '';
  
  produits.forEach(produit => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${produit.id}</td>
          <td>${produit.nom}</td>
          <td>${produit.prix} DT</td>
          <td>${produit.stock}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteProduit(${produit.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}
async function searchProduits() {
  const term = document.getElementById('produit-search').value;
  const response = await fetch(`/produits/search?term=${encodeURIComponent(term)}`);
  const produits = await response.json();
  const tbody = document.getElementById('produits-table');
  tbody.innerHTML = '';
  
  produits.forEach(produit => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${produit.id}</td>
          <td>${produit.nom}</td>
          <td>${produit.prix} DT</td>
          <td>${produit.stock}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteProduit(${produit.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

async function deleteProduit(id) {
  if (confirm('Supprimer ce produit ?')) {
      await fetch(`/produits/${id}`, {method: 'DELETE'});
      loadProduits();
  }
}

async function loadCommandes() {
  const response = await fetch('/commandes');
  const commandes = await response.json();
  const tbody = document.getElementById('commandes-table');
  tbody.innerHTML = '';
  
  commandes.forEach(commande => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${commande.id}</td>
          <td>${commande.client_nom}</td>
          <td>${commande.produit_nom}</td>
          <td>${new Date(commande.date_commande).toLocaleDateString()}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteCommande(${commande.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

async function searchCommandes() {
  const term = document.getElementById('commande-search').value;
  const response = await fetch(`/commandes/search?term=${encodeURIComponent(term)}`);
  const commandes = await response.json();
  const tbody = document.getElementById('commandes-table');
  tbody.innerHTML = '';
  
  commandes.forEach(commande => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${commande.id}</td>
          <td>${commande.client_nom}</td>
          <td>${commande.produit_nom}</td>
          <td>${new Date(commande.date_commande).toLocaleDateString()}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="deleteCommande(${commande.id})">Supprimer</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
}

async function deleteCommande(id) {
  if (confirm('Supprimer cette commande ?')) {
      await fetch(`/commandes/${id}`, {method: 'DELETE'});
      loadCommandes();
  }
}


document.getElementById('form-client').addEventListener('submit', async (e) => {
  e.preventDefault();
  const client = {
      nom: document.getElementById('client-nom').value,
      prenom: document.getElementById('client-prenom').value,
      email: document.getElementById('client-email').value
  };
  await fetch('/clients', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(client)
  });
  document.getElementById('form-client').reset();
  loadClients();
});

document.getElementById('form-produit').addEventListener('submit', async (e) => {
  e.preventDefault();
  const produit = {
      nom: document.getElementById('produit-nom').value,
      prix: parseFloat(document.getElementById('produit-prix').value),
      stock: parseInt(document.getElementById('produit-stock').value)
  };
  await fetch('/produits', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(produit)
  });
  document.getElementById('form-produit').reset();
  loadProduits();
});

document.getElementById('form-commande').addEventListener('submit', async (e) => {
  e.preventDefault();
  const commande = {
      client_id: document.getElementById('commande-client').value,
      produit_id: document.getElementById('commande-produit').value
  };
  await fetch('/commandes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(commande)
  });
  document.getElementById('form-commande').reset();
  loadCommandes();
});


async function init() {
  const [clientsRes, produitsRes] = await Promise.all([
      fetch('/clients'),
      fetch('/produits')
  ]);
  const [clients, produits] = await Promise.all([
      clientsRes.json(),
      produitsRes.json()
  ]);
  
  const clientSelect = document.getElementById('commande-client');
  clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.prenom} ${client.nom}`;
      clientSelect.appendChild(option);
  });
  
  const produitSelect = document.getElementById('commande-produit');
  produits.forEach(produit => {
      const option = document.createElement('option');
      option.value = produit.id;
      option.textContent = `${produit.nom} (${produit.prix}DT)`;
      produitSelect.appendChild(option);
  });
  
  loadClients();
  loadProduits();
  loadCommandes();
}
async function deleteClient(id) {
  if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
          const response = await fetch(`http://localhost:3000/clients/${id}`, {
              method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
              loadClients(); 
          }
      } catch (error) {
          console.error(error);
          alert('Échec de la suppression');
      }
  }
}

async function deleteProduit(id) {
  if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
          const response = await fetch(`http://localhost:3000/produits/${id}`, {
              method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
              loadProduits();
          }
      } catch (error) {
          console.error(error);
          alert('Échec de la suppression');
      }
  }
}

async function deleteCommande(id) {
  if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      try {
          const response = await fetch(`http://localhost:3000/commandes/${id}`, {
              method: 'DELETE'
          });
          const data = await response.json();
          if (data.success) {
              loadCommandes();
          }
      } catch (error) {
          console.error(error);
          alert('Échec de la suppression');
      }
      function showSection(id, element) {
        // Affiche la bonne section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');
    
        // Met à jour les onglets
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.classList.remove('active');
        });
        element.classList.add('active');
    }
    
    
    
    
  }
}
init();
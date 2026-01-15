-- Schéma EPS Manager pour Supabase (PostgreSQL)
-- À exécuter dans le SQL Editor de Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Établissements Publics de Santé
CREATE TABLE eps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CSR', 'CSU', 'CSRURAL', 'HOPITAL', 'DISPENSAIRE')),
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  adresse TEXT,
  telephone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Utilisateurs (authentification Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID REFERENCES eps(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'AGENT' CHECK (role IN ('ADMIN', 'DIRECTEUR', 'CHEF_SERVICE', 'MEDECIN', 'INFIRMIER', 'PHARMACIEN', 'AGENT_ADMIN', 'AGENT_HYGIENE', 'AGENT')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personnel
CREATE TABLE personnel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  matricule TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  fonction TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('A', 'B', 'C', 'D')),
  specialite TEXT,
  telephone TEXT,
  email TEXT,
  statut TEXT DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'CONGE', 'MISSION', 'SUSPENDU', 'RETRAITE')),
  date_recrutement DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(eps_id, matricule)
);

-- Congés
CREATE TABLE conges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personnel_id UUID NOT NULL REFERENCES personnel(id),
  type TEXT NOT NULL CHECK (type IN ('ANNUEL', 'MALADIE', 'MATERNITE', 'PATERNITE', 'SANS_SOLDE', 'AUTRE')),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'APPROUVE', 'REFUSE')),
  motif TEXT,
  approbateur_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gardes
CREATE TABLE gardes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personnel_id UUID NOT NULL REFERENCES personnel(id),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('JOUR', 'NUIT', 'WEEKEND', 'FERIE')),
  service TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indicateurs PBF
CREATE TABLE indicateurs_pbf (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  ponderation FLOAT DEFAULT 1,
  unite TEXT NOT NULL,
  prix_unitaire FLOAT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Réalisations PBF
CREATE TABLE realisations_pbf (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  indicateur_id UUID NOT NULL REFERENCES indicateurs_pbf(id),
  periode DATE NOT NULL,
  quantite FLOAT NOT NULL,
  montant_calcule FLOAT NOT NULL,
  valide BOOLEAN DEFAULT FALSE,
  valide_par UUID REFERENCES users(id),
  date_validation TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(eps_id, indicateur_id, periode)
);

-- Transactions financières
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  type TEXT NOT NULL CHECK (type IN ('RECETTE', 'DEPENSE', 'TRANSFERT')),
  categorie TEXT NOT NULL,
  montant DECIMAL(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Produits pharmaceutiques
CREATE TABLE produits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  code TEXT NOT NULL,
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,
  unite TEXT NOT NULL,
  seuil_alerte INTEGER DEFAULT 10,
  prix_unitaire DECIMAL(10, 2),
  stockage TEXT,
  total_stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(eps_id, code)
);

-- Mouvements de stock
CREATE TABLE mouvements_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produit_id UUID NOT NULL REFERENCES produits(id),
  type TEXT NOT NULL CHECK (type IN ('ENTREE', 'SORTIE', 'AJUSTEMENT', 'PEREMPTION')),
  quantite INTEGER NOT NULL,
  motif TEXT,
  reference TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklists d'hygiène
CREATE TABLE checklists_hygiene (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  date DATE NOT NULL,
  lieu TEXT NOT NULL,
  score FLOAT,
  items JSONB NOT NULL,
  realisee_par TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archives et documents
CREATE TABLE archives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eps_id UUID NOT NULL REFERENCES eps(id),
  titre TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('RAPPORT', 'DOCUMENT', 'INVENTAIRE', 'PROTOCOLE', 'LISTE')),
  categorie TEXT NOT NULL CHECK (categorie IN ('PBF', 'ADMINISTRATION', 'PHARMACIE', 'HYGIENE', 'RH')),
  date DATE NOT NULL,
  format TEXT NOT NULL,
  auteur TEXT,
  fichier_url TEXT,
  taille BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Régions de Côte d'Ivoire
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Districts
CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID NOT NULL REFERENCES regions(id),
  nom TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  UNIQUE(region_id, nom),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des régions de Côte d'Ivoire
INSERT INTO regions (nom, code) VALUES
('Abidjan', 'ABJ'),
('Bas-Sassandra', 'BS'),
('Comoé', 'COM'),
('Denguélé', 'DEN'),
('Gôh-Djiboua', 'GD'),
('Lacs', 'LA'),
('Lagunes', 'LAG'),
('Montagnes', 'MONT'),
('Sassandra-Marahoué', 'SM'),
('Savanes', 'SAV'),
('Sud-Bandama', 'SB'),
('Sud-Comoé', 'SC'),
('Vallée du Bandama', 'VB'),
('Woroba', 'WOR'),
('Zanzan', 'ZAN');

-- Row Level Security (RLS) Policies
ALTER TABLE eps ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE conges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gardes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists_hygiene ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (à adapter selon vos besoins)
CREATE POLICY "Users can view EPS data" ON eps FOR SELECT USING (true);
CREATE POLICY "Users can view their EPS data" ON users FOR SELECT USING (true);
CREATE POLICY "Personnel visible to all" ON personnel FOR SELECT USING (true);
CREATE POLICY "Conge visible to all" ON conges FOR SELECT USING (true);

-- Index pour performance
CREATE INDEX idx_personnel_eps ON personnel(eps_id);
CREATE INDEX idx_conges_personnel ON conges(personnel_id);
CREATE INDEX idx_gardes_date ON gardes(date);
CREATE INDEX idx_transactions_eps ON transactions(eps_id);
CREATE INDEX idx_produits_eps ON produits(eps_id);
CREATE INDEX idx_checklists_eps ON checklists_hygiene(eps_id);
CREATE INDEX idx_archives_eps ON archives(eps_id);

-- Fonction pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_eps_updated_at BEFORE UPDATE ON eps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produits_updated_at BEFORE UPDATE ON produits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists_hygiene FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archives_updated_at BEFORE UPDATE ON archives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour seed données initiales
CREATE OR REPLACE FUNCTION seed_demo_data()
RETURNS VOID AS $$
DECLARE
  eps_id UUID;
  user_id UUID;
BEGIN
  -- Créer un EPS demo
  INSERT INTO eps (name, code, type, region, district, adresse, telephone, email)
  VALUES ('Centre de Santé de Référence d''Abidjan', 'CSR-ABJ-001', 'CSR', 'Abidjan', 'Abidjan', 'Plateau', '+225 27 20 00 00 00', 'contact@csr-abidjan.ci')
  RETURNING id INTO eps_id;

  -- Créer utilisateur admin
  INSERT INTO users (eps_id, email, name, role)
  VALUES (eps_id, 'admin@eps-manager.ci', 'Administrateur', 'ADMIN')
  RETURNING id INTO user_id;

  -- Créer utilisateur directeur
  INSERT INTO users (eps_id, email, name, role)
  VALUES (eps_id, 'directeur@eps-manager.ci', 'Dr. Kouamé', 'DIRECTEUR');

  -- Créer du personnel
  INSERT INTO personnel (eps_id, matricule, nom, prenom, fonction, categorie, telephone, email, statut)
  VALUES 
    (eps_id, 'P001', 'Kouamé', 'Jean', 'Médecin Chef', 'A', '+225 07 0000 0001', 'p001@csr-abidjan.ci', 'ACTIF'),
    (eps_id, 'P002', 'Traoré', 'Fatou', 'Infirmière', 'B', '+225 07 0000 0002', 'p002@csr-abidjan.ci', 'ACTIF'),
    (eps_id, 'P003', 'Diallo', 'Ali', 'Pharmacien', 'A', '+225 07 0000 0003', 'p003@csr-abidjan.ci', 'ACTIF'),
    (eps_id, 'P004', 'Bamba', 'Marie', 'Agent Administratif', 'C', '+225 07 0000 0004', 'p004@csr-abidjan.ci', 'ACTIF'),
    (eps_id, 'P005', 'Ouattara', 'Paul', 'Agent d''Hygiène', 'D', '+225 07 0000 0005', 'p005@csr-abidjan.ci', 'ACTIF');

  -- Créer indicateurs PBF
  INSERT INTO indicateurs_pbf (code, nom, ponderation, unite, prix_unitaire)
  VALUES
    ('PBF-CONS', 'Consultation curative', 1, 'consultation', 500),
    ('PBF-PREPA', 'Prise en charge enfants 0-5 ans', 1, 'enfant', 1000),
    ('PBF-CPN', 'Consultation Prénatale', 1, 'consultation', 800),
    ('PBF-ACCOU', 'Accouchements eutociques', 1, 'accouchement', 5000),
    ('PBF-VACC', 'Vaccination', 1, 'dose', 200);

  -- Créer produits
  INSERT INTO produits (eps_id, code, nom, categorie, unite, seuil_alerte, prix_unitaire, stockage, total_stock)
  VALUES
    (eps_id, 'PARA-500', 'Paracétamol 500mg', 'Analgésiques', 'comprimé', 100, 50, 'Armoire A', 250),
    (eps_id, 'AMOX-250', 'Amoxicilline 250mg', 'Antibiotiques', 'gélule', 50, 75, 'Armoire B', 80),
    (eps_id, 'SEROUM', 'Sérum physiologique', 'Solutés', 'flacon', 20, 200, 'Armoire C', 45),
    (eps_id, 'DIAZEP', 'Diazépam 10mg', 'Psychotropes', 'comprimé', 30, 100, 'Armoire D', 40),
    (eps_id, 'OXYG', 'Oxygène médical', 'Gaz médicaux', 'm3', 5, 5000, 'Stock gaz', 10);

  RAISE NOTICE 'Données démo créées avec succès !';
END;
$$ LANGUAGE plpgsql;

-- Exécuter le seed
SELECT seed_demo_data();
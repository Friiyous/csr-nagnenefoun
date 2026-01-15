-- =============================================
-- EPS Manager - Seed Données
-- Centre de Santé Rural de Nagnénéfoun
-- Région du Poro - District Sanitaire de Korhogo
-- =============================================

-- Fonction pour seed données initiales
CREATE OR REPLACE FUNCTION seed_demo_data()
RETURNS VOID AS $$
DECLARE
  eps_id UUID;
  user_id UUID;
BEGIN
  -- Créer l'EPS : Établissement Public de Santé de Premier Contact (EPSC)
  INSERT INTO eps (name, code, type, region, district, adresse, telephone, email)
  VALUES (
    'Établissement Public de Santé de Premier Contact de Nagnénéfoun',
    'EPSC-NAGNENEFOUN',
    'CSRURAL',
    'Poro',
    'Korhogo',
    'Nagnénéfoun, Côte d''Ivoire',
    '+225 00 00 00 00 00',
    'epsc.nagnenefoun@sante.gouv.ci'
  )
  RETURNING id INTO eps_id;

  -- Créer utilisateur ADMIN
  INSERT INTO users (eps_id, email, name, role)
  VALUES (eps_id, 'admin@eps.ci', 'Administrateur', 'ADMIN')
  RETURNING id INTO user_id;

  -- Créer utilisateur DIRECTEUR
  INSERT INTO users (eps_id, email, name, role)
  VALUES (eps_id, 'directeur@eps.ci', 'Dr. Directeur', 'DIRECTEUR');

  -- Créer du personnel
  INSERT INTO personnel (eps_id, matricule, nom, prenom, fonction, categorie, telephone, email, statut)
  VALUES 
    (eps_id, 'P001', 'Kouamé', 'Jean', 'Médecin Chef', 'A', '+225 07 00 00 00 01', 'p001@eps.ci', 'ACTIF'),
    (eps_id, 'P002', 'Traoré', 'Fatou', 'Infirmière', 'B', '+225 07 00 00 00 02', 'p002@eps.ci', 'ACTIF'),
    (eps_id, 'P003', 'Diallo', 'Ali', 'Pharmacien', 'A', '+225 07 00 00 00 03', 'p003@eps.ci', 'ACTIF'),
    (eps_id, 'P004', 'Bamba', 'Marie', 'Agent Administratif', 'C', '+225 07 00 00 00 04', 'p004@eps.ci', 'ACTIF'),
    (eps_id, 'P005', 'Ouattara', 'Paul', 'Agent d''Hygiène', 'D', '+225 07 00 00 00 05', 'p005@eps.ci', 'ACTIF');

  -- Créer indicateurs PBF pour la région du Poro
  INSERT INTO indicateurs_pbf (code, nom, ponderation, unite, prix_unitaire, actif)
  VALUES
    ('PBF-CONS', 'Consultation curative', 1, 'consultation', 500, true),
    ('PBF-PREPA', 'Prise en charge enfants 0-5 ans', 1, 'enfant', 1000, true),
    ('PBF-CPN', 'Consultation Prénatale', 1, 'consultation', 800, true),
    ('PBF-ACCOU', 'Accouchements eutociques', 1, 'accouchement', 5000, true),
    ('PBF-VACC', 'Vaccination', 1, 'dose', 200, true),
    ('PBF-PF', 'Planification Familiale', 1, 'consultation', 600, true),
    ('PBF-CUR', 'Soins curatifs enfants', 1, 'enfant', 400, true),
    ('PBF-PAL', 'Prise en charge PAL', 1, 'cas', 2500, true);

  -- Créer produits pharmaceutiques de base
  INSERT INTO produits (eps_id, code, nom, categorie, unite, seuil_alerte, prix_unitaire, stockage, total_stock)
  VALUES
    -- Analgésiques
    (eps_id, 'PARA-500', 'Paracétamol 500mg', 'Analgésiques', 'comprimé', 100, 50, 'Armoire A', 250),
    (eps_id, 'IBUP-400', 'Ibuprofène 400mg', 'Analgésiques', 'comprimé', 80, 75, 'Armoire A', 180),
    -- Antibiotiques
    (eps_id, 'AMOX-250', 'Amoxicilline 250mg', 'Antibiotiques', 'gélule', 50, 75, 'Armoire B', 80),
    (eps_id, 'AMOX-500', 'Amoxicilline 500mg', 'Antibiotiques', 'gélule', 40, 100, 'Armoire B', 60),
    (eps_id, 'COTRIM', 'Cotrimoxazole', 'Antibiotiques', 'comprimé', 60, 60, 'Armoire B', 90),
    -- Solutés
    (eps_id, 'SEROUM', 'Sérum physiologique 500ml', 'Solutés', 'flacon', 20, 200, 'Armoire C', 45),
    (eps_id, 'GLUC-5', 'Glucosé 5% 500ml', 'Solutés', 'flacon', 15, 200, 'Armoire C', 30),
    -- Antimalariques
    (eps_id, 'ASAQ', 'ASAQ (Artémether+Luméfantrine)', 'Antimalariques', 'cp', 30, 150, 'Armoire D', 50),
    (eps_id, 'ACT', 'ACT 25/67.5mg', 'Antimalariques', 'cp', 40, 120, 'Armoire D', 70),
    -- Vaccins
    (eps_id, 'DTC', 'DTC-HepB-Hib', 'Vaccins', 'dose', 20, 300, 'Réfrigérateur', 40),
    (eps_id, 'VAA', 'Vaccin Antiamaril', 'Vaccins', 'dose', 10, 500, 'Réfrigérateur', 15),
    -- Soins
    (eps_id, 'BETAD', 'Bétadine scrub', 'Antiseptiques', 'flacon', 10, 800, 'Armoire E', 25),
    (eps_id, 'ALCOOL', 'Alcool 70°', 'Antiseptiques', 'litre', 5, 400, 'Armoire E', 12);

  RAISE NOTICE '✓ Données EPSC de Nagnénéfoun créées avec succès !';
  RAISE NOTICE '  - EPSC: Établissement Public de Santé de Premier Contact de Nagnénéfoun';
  RAISE NOTICE '  - Région: Poro - District: Korhogo';
END;
$$ LANGUAGE plpgsql;

-- Exécuter le seed
SELECT seed_demo_data();
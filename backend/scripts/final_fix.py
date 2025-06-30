#!/usr/bin/env python3
"""
Script final pour corriger et insérer des données
"""
import sys
import os
from sqlalchemy import create_engine, text

# Ajouter le répertoire parent au path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def final_fix(engine):
    """Correction finale et insertion de données"""
    print("🔧 Correction finale...")
    
    with engine.connect() as conn:
        # Récupérer les IDs nécessaires
        result = conn.execute(text("SELECT id FROM equipment LIMIT 3"))
        equipment_ids = [row[0] for row in result.fetchall()]
        
        result = conn.execute(text("SELECT id FROM maintenance_plans LIMIT 3"))
        plan_ids = [row[0] for row in result.fetchall()]
        
        result = conn.execute(text("SELECT id FROM users WHERE role = 'technician' LIMIT 1"))
        technician_result = result.fetchone()
        technician_id = technician_result[0] if technician_result else None
        
        if equipment_ids and plan_ids:
            # Supprimer les données existantes
            conn.execute(text("DELETE FROM scheduled_maintenances"))
            conn.commit()
            
            # Insérer des maintenances avec tous les champs requis
            complete_data = [
                {
                    'maintenance_plan_id': plan_ids[0],
                    'equipment_id': equipment_ids[0],
                    'scheduled_date': '2025-07-02 08:00:00',
                    'estimated_start_time': '08:00:00',
                    'estimated_end_time': '10:00:00',
                    'assigned_technician_id': technician_id,
                    'status': 'SCHEDULED',
                    'priority': 'MEDIUM',
                    'notes': 'Maintenance préventive',
                    'title': 'Maintenance Robot',
                    'description': 'Maintenance préventive du robot de soudage',
                    'frequency_type': 'monthly',
                    'frequency_value': 1,
                    'next_due_date': '2025-08-02 08:00:00',
                    'estimated_duration': 120,
                    'is_active': True
                },
                {
                    'maintenance_plan_id': plan_ids[1] if len(plan_ids) > 1 else plan_ids[0],
                    'equipment_id': equipment_ids[1] if len(equipment_ids) > 1 else equipment_ids[0],
                    'scheduled_date': '2025-07-05 14:00:00',
                    'estimated_start_time': '14:00:00',
                    'estimated_end_time': '16:00:00',
                    'assigned_technician_id': technician_id,
                    'status': 'SCHEDULED',
                    'priority': 'HIGH',
                    'notes': 'Inspection trimestrielle',
                    'title': 'Inspection Convoyeur',
                    'description': 'Inspection trimestrielle du convoyeur',
                    'frequency_type': 'quarterly',
                    'frequency_value': 1,
                    'next_due_date': '2025-10-05 14:00:00',
                    'estimated_duration': 90,
                    'is_active': True
                },
                {
                    'maintenance_plan_id': plan_ids[2] if len(plan_ids) > 2 else plan_ids[0],
                    'equipment_id': equipment_ids[2] if len(equipment_ids) > 2 else equipment_ids[0],
                    'scheduled_date': '2025-07-08 09:00:00',
                    'estimated_start_time': '09:00:00',
                    'estimated_end_time': '11:00:00',
                    'assigned_technician_id': technician_id,
                    'status': 'IN_PROGRESS',
                    'priority': 'CRITICAL',
                    'notes': 'Maintenance corrective',
                    'title': 'Maintenance Presse',
                    'description': 'Maintenance corrective de la presse',
                    'frequency_type': 'weekly',
                    'frequency_value': 2,
                    'next_due_date': '2025-07-22 09:00:00',
                    'estimated_duration': 60,
                    'is_active': True
                },
                # Ajouter plus de maintenances pour le calendrier
                {
                    'maintenance_plan_id': plan_ids[0],
                    'equipment_id': equipment_ids[0],
                    'scheduled_date': '2025-07-10 10:00:00',
                    'estimated_start_time': '10:00:00',
                    'estimated_end_time': '12:00:00',
                    'assigned_technician_id': technician_id,
                    'status': 'SCHEDULED',
                    'priority': 'MEDIUM',
                    'notes': 'Maintenance hebdomadaire',
                    'title': 'Maintenance Robot',
                    'description': 'Maintenance hebdomadaire du robot',
                    'frequency_type': 'weekly',
                    'frequency_value': 1,
                    'next_due_date': '2025-07-17 10:00:00',
                    'estimated_duration': 120,
                    'is_active': True
                },
                {
                    'maintenance_plan_id': plan_ids[1] if len(plan_ids) > 1 else plan_ids[0],
                    'equipment_id': equipment_ids[1] if len(equipment_ids) > 1 else equipment_ids[0],
                    'scheduled_date': '2025-07-15 15:00:00',
                    'estimated_start_time': '15:00:00',
                    'estimated_end_time': '17:00:00',
                    'assigned_technician_id': technician_id,
                    'status': 'COMPLETED',
                    'priority': 'HIGH',
                    'notes': 'Maintenance terminée',
                    'title': 'Réparation Convoyeur',
                    'description': 'Réparation du convoyeur terminée',
                    'frequency_type': 'monthly',
                    'frequency_value': 1,
                    'next_due_date': '2025-08-15 15:00:00',
                    'estimated_duration': 120,
                    'is_active': True
                }
            ]
            
            for data in complete_data:
                try:
                    conn.execute(text("""
                        INSERT INTO scheduled_maintenances 
                        (maintenance_plan_id, equipment_id, scheduled_date, 
                         estimated_start_time, estimated_end_time, assigned_technician_id, 
                         status, priority, notes, title, description, frequency_type,
                         frequency_value, next_due_date, estimated_duration, is_active)
                        VALUES 
                        (:maintenance_plan_id, :equipment_id, :scheduled_date,
                         :estimated_start_time, :estimated_end_time, :assigned_technician_id,
                         :status, :priority, :notes, :title, :description, :frequency_type,
                         :frequency_value, :next_due_date, :estimated_duration, :is_active)
                    """), data)
                except Exception as e:
                    print(f"⚠️  Erreur insertion: {e}")
            
            conn.commit()
            
            # Vérifier le résultat
            result = conn.execute(text("SELECT COUNT(*) FROM scheduled_maintenances"))
            count = result.scalar()
            print(f"✅ {count} maintenances planifiées insérées")
            
            # Afficher les données
            result = conn.execute(text("""
                SELECT sm.title, sm.scheduled_date, sm.status, sm.priority, e.name as equipment_name
                FROM scheduled_maintenances sm
                LEFT JOIN equipment e ON sm.equipment_id = e.id
                ORDER BY sm.scheduled_date
            """))
            
            maintenances = result.fetchall()
            print("\n📊 Maintenances planifiées:")
            for maintenance in maintenances:
                print(f"   • {maintenance[0]} - {maintenance[1]} - {maintenance[2]} ({maintenance[3]}) - {maintenance[4]}")

def main():
    """Fonction principale"""
    print("🚀 Correction finale...")
    
    try:
        engine = create_engine(settings.DATABASE_URL)
        final_fix(engine)
        
        print("\n✅ Correction finale terminée!")
        print("\n🔄 Redémarrez le serveur backend.")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        raise

if __name__ == "__main__":
    main()

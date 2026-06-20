import json

with open('presupuesto_detalle.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Contar registros con destinación étnica
total = len(data['registros'])
con_destinacion = sum(1 for r in data['registros'] if r['destinacionEtnica'])
sin_destinacion = total - con_destinacion

print(f'Total registros: {total:,}')
print(f'Con destinacion etnica: {con_destinacion:,} ({con_destinacion/total*100:.2f}%)')
print(f'Sin destinacion etnica: {sin_destinacion:,} ({sin_destinacion/total*100:.2f}%)')
print()
print('Ejemplos con destinacion etnica:')
ejemplos = [r for r in data['registros'] if r['destinacionEtnica']][:5]
for ej in ejemplos:
    print(f'  - {ej["nombreEntidad"]} ({ej["tipoEntidad"]}) - {ej["conceptoGasto"]}')
print()

# Contar por tipo de entidad
from collections import defaultdict
por_tipo = defaultdict(int)
for r in data['registros']:
    if r['destinacionEtnica']:
        por_tipo[r['tipoEntidad']] += 1

print('Distribucion por tipo de entidad:')
for tipo, count in sorted(por_tipo.items(), key=lambda x: x[1], reverse=True):
    print(f'  - {tipo}: {count}')

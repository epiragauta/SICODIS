import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  MunicipioEficiencia,
  ResumenMunicipioEficiencia
} from './sicodis-api.service';

/**
 * Servicio mock para datos de eficiencias fiscales y administrativas
 *
 * Este servicio carga datos desde archivos JSON estáticos en lugar de llamar al API.
 * Es útil cuando el API backend no está disponible o en desarrollo.
 *
 * Los datos se cargan una sola vez y se cachean en memoria para mejorar el rendimiento.
 */
@Injectable({
  providedIn: 'root'
})
export class EficienciasMockService {
  private datosCache: any = null;
  private readonly dataPath = '/assets/data/eficiencias/resumen-municipios.json';

  constructor(private http: HttpClient) {
    console.log('📁 EficienciasMockService inicializado - usando datos estáticos');
  }

  /**
   * Cargar datos desde archivo JSON (solo una vez)
   * Los datos se cachean en memoria para llamadas subsecuentes
   */
  private loadData(): Observable<any> {
    if (this.datosCache) {
      console.log('📦 Usando datos cacheados');
      return of(this.datosCache);
    }

    console.log('📥 Cargando datos desde:', this.dataPath);
    return this.http.get(this.dataPath).pipe(
      map(data => {
        this.datosCache = data;
        console.log('✅ Datos cargados y cacheados:', Object.keys(data).length, 'municipios');
        return data;
      }),
      catchError(error => {
        console.error('❌ Error cargando datos mock:', error);
        throw error;
      })
    );
  }

  /**
   * Obtener todos los municipios disponibles en los datos mock
   * @returns Observable con array de municipios
   */
  getMunicipios(): Observable<MunicipioEficiencia[]> {
    return this.loadData().pipe(
      map(data => {
        const municipios = Object.values(data).map((item: any) => item.municipio);
        console.log('📋 Municipios disponibles:', municipios.length);
        return municipios;
      })
    );
  }

  /**
   * Obtener resumen completo de un municipio específico
   * @param codigoDane Código DANE del municipio (ej: '05001' para Medellín)
   * @returns Observable con resumen completo del municipio
   */
  getResumenMunicipio(codigoDane: string): Observable<ResumenMunicipioEficiencia> {
    return this.loadData().pipe(
      map(data => {
        const municipioData = data[codigoDane];

        if (!municipioData) {
          console.warn(`⚠️ Municipio ${codigoDane} no encontrado en datos mock`);
          throw new Error(`Municipio ${codigoDane} no encontrado en datos mock`);
        }

        console.log('✅ Resumen del municipio obtenido:', municipioData.municipio.municipio);
        return municipioData as ResumenMunicipioEficiencia;
      })
    );
  }

  /**
   * Obtener municipio específico por código DANE
   * @param codigoDane Código DANE del municipio
   * @returns Observable con datos del municipio
   */
  getMunicipioByCodigo(codigoDane: string): Observable<MunicipioEficiencia> {
    return this.loadData().pipe(
      map(data => {
        const municipioData = data[codigoDane];

        if (!municipioData) {
          throw new Error(`Municipio ${codigoDane} no encontrado en datos mock`);
        }

        return municipioData.municipio as MunicipioEficiencia;
      })
    );
  }
}

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import useMateriasStore from '../../../stores/materiasStore'
import { useUsuariosStore } from '../../../stores/usuariosStore'
import { horariosService } from '../../../services/horariosService'
import { comisionesService } from '../../../services/comisionesService'
import BuscarMateriaModal from './BuscarMateriaModal'
import Modal from '../../../components/ui/Modal/Modal'

const TABS = [
  { id: 'materias', label: 'Materias' },
  { id: 'horarios', label: 'Horarios por Comision' },
]

const nombresCuatri = {
  1: 'Primer Cuatrimestre',
  2: 'Segundo Cuatrimestre',
  3: 'Tercer Cuatrimestre',
  4: 'Cuarto Cuatrimestre',
  5: 'Quinto Cuatrimestre',
  6: 'Sexto Cuatrimestre',
}

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const HORARIO_REGEX = /^\d{2}:\d{2}-\d{2}:\d{2}$/

const semestreDeCuatri = (cuatri) => ((cuatri - 1) % 2) + 1

const CarreraDetailAdmin = () => {
  const { id } = useParams()
  const { selectedCarrera, loading, fetchCarreraById } = useCarrerasStore()
  const { materias, fetchMaterias, addAsignacion, removeAsignacion } = useMateriasStore()
  const [activeTab, setActiveTab] = useState('materias')
  const [buscarModalOpen, setBuscarModalOpen] = useState(false)
  const [cuatriPrefijado, setCuatriPrefijado] = useState(null)
  const [horarios, setHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)

  const [cuatriActivo, setCuatriActivo] = useState(1)
  const [comisiones, setComisiones] = useState([])
  const [comisionesLoading, setComisionesLoading] = useState(false)
  const [comisionActiva, setComisionActiva] = useState(null)
  const [selectedComisionIds, setSelectedComisionIds] = useState([])
  const [comisionFormOpen, setComisionFormOpen] = useState(false)
  const [comisionFormData, setComisionFormData] = useState({ nombre: '', anio_lectivo: new Date().getFullYear(), semestre: 1, encargado_id: '' })
  const [filtroAnioLectivo, setFiltroAnioLectivo] = useState(new Date().getFullYear().toString())
  const [batchForm, setBatchForm] = useState({})
  const [errores, setErrores] = useState({})
  const [guardandoBatch, setGuardandoBatch] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const successTimer = useRef(null)
  const [batchMsg, setBatchMsg] = useState('')
  const batchTimer = useRef(null)
  const skipFormResetRef = useRef(false)

  const { usuarios, fetchUsuarios } = useUsuariosStore()

  useEffect(() => {
    if (id) fetchCarreraById(id)
  }, [id, fetchCarreraById])

  useEffect(() => {
    if (activeTab === 'horarios') {
      fetchUsuarios()
    }
  }, [activeTab, fetchUsuarios])

  const fetchHorarios = useCallback(async () => {
    if (!id) return
    setLoadingHorarios(true)
    try {
      const res = await horariosService.getAll({ carrera_id: parseInt(id) })
      setHorarios(res.data?.data || res.data || [])
    } catch {
      setHorarios([])
    } finally {
      setLoadingHorarios(false)
    }
  }, [id])

  const fetchComisiones = useCallback(async () => {
    if (!id) return
    setComisionesLoading(true)
    try {
      const res = await comisionesService.getAll({ carrera_id: parseInt(id) })
      const data = res.data?.data || res.data || []
      setComisiones(data)
      const idsDisponibles = new Set(data.map((c) => c.id))
      setComisionActiva((prev) => {
        if (!prev) return null
        return idsDisponibles.has(prev.id) ? prev : null
      })
      setSelectedComisionIds((prev) => prev.filter((id) => idsDisponibles.has(id)))
    } catch {
      setComisiones([])
    } finally {
      setComisionesLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (activeTab === 'horarios' && id) {
      fetchHorarios()
      fetchComisiones()
    }
  }, [activeTab, id, fetchHorarios, fetchComisiones])

  const toggleComisionSelection = (comisionId) => {
    setSelectedComisionIds((prev) =>
      prev.includes(comisionId)
        ? prev.filter((id) => id !== comisionId)
        : [...prev, comisionId]
    )
  }

  const handleComisionClick = (com) => {
    setComisionActiva(com)
    if (!selectedComisionIds.includes(com.id)) {
      setSelectedComisionIds((prev) => [...prev, com.id])
    }
  }

  const cohortYear = useMemo(() => {
    const viewYear = parseInt(filtroAnioLectivo) || new Date().getFullYear()
    const planYear = Math.ceil(cuatriActivo / 2)
    return viewYear - planYear + 1
  }, [cuatriActivo, filtroAnioLectivo])

  const openComisionForm = () => {
    setComisionFormData({
      nombre: '',
      anio_lectivo: cohortYear,
      semestre: semestreDeCuatri(cuatriActivo),
      encargado_id: '',
    })
    setComisionFormOpen(true)
  }

  const handleCreateComision = async () => {
    const { nombre, anio_lectivo, semestre, encargado_id } = comisionFormData
    const nombres = nombre
      .split(',')
      .map((n) => n.trim().toUpperCase())
      .filter((n) => n.length > 0)
    const uniqueNombres = [...new Set(nombres)]
    if (uniqueNombres.length === 0) return
    const basePayload = {
      carrera_id: parseInt(id),
      anio_lectivo: parseInt(anio_lectivo),
      semestre: parseInt(semestre),
    }
    if (encargado_id) basePayload.encargado_id = parseInt(encargado_id)
    let creadas = 0
    let fallaron = 0
    for (const n of uniqueNombres) {
      try {
        await comisionesService.create({ ...basePayload, nombre: n })
        creadas++
      } catch {
        fallaron++
      }
    }
    setComisionFormOpen(false)
    await fetchComisiones()
    if (fallaron === 0) {
      mostrarExito(`${creadas} comision${creadas !== 1 ? 'es' : ''} creada${creadas !== 1 ? 's' : ''}.`)
    } else {
      mostrarExito(`${creadas} creada${creadas !== 1 ? 's' : ''}, ${fallaron} fallaron (pueden existir ya).`)
    }
  }

  const mostrarExito = useCallback((msg) => {
    setSuccessMsg(msg)
    if (successTimer.current) clearTimeout(successTimer.current)
    successTimer.current = setTimeout(() => setSuccessMsg(''), 3000)
  }, [])

  const mostrarBatchMsg = useCallback((msg) => {
    setBatchMsg(msg)
    if (batchTimer.current) clearTimeout(batchTimer.current)
    batchTimer.current = setTimeout(() => setBatchMsg(''), 4000)
  }, [])

  const carrera = selectedCarrera
  const esVirtual = carrera?.modalidad === 'virtual'

  const maxCuatri = useMemo(() => {
    if (!carrera?.duracion) return 12
    return carrera.duracion * 2
  }, [carrera])

  const materiasPorCuatri = useMemo(() => {
    if (!carrera?.carreraMaterias) return []
    const grupos = {}
    carrera.carreraMaterias.forEach((cm) => {
      const c = cm.cuatrimestre || 1
      if (!grupos[c]) grupos[c] = []
      grupos[c].push(cm)
    })
    return Object.entries(grupos).sort(([a], [b]) => Number(a) - Number(b))
  }, [carrera])

  const cuatrimestresDisponibles = useMemo(() => {
    const set = new Set(materiasPorCuatri.map(([c]) => Number(c)))
    return Array.from(set).sort((a, b) => a - b)
  }, [materiasPorCuatri])

  const proximoCuatri = useMemo(() => {
    if (cuatrimestresDisponibles.length === 0) return 1
    const max = Math.max(...cuatrimestresDisponibles)
    return Math.min(maxCuatri, max + 1)
  }, [cuatrimestresDisponibles, maxCuatri])

  useEffect(() => {
    if (activeTab === 'horarios' && cuatrimestresDisponibles.length > 0 && !cuatrimestresDisponibles.includes(cuatriActivo)) {
      setCuatriActivo(cuatrimestresDisponibles[0])
    }
  }, [activeTab, cuatrimestresDisponibles, cuatriActivo])

  const materiasCuatriActual = useMemo(() => {
    return carrera?.carreraMaterias?.filter((cm) => (cm.cuatrimestre || 1) === cuatriActivo) || []
  }, [carrera, cuatriActivo])

  const materiaIdsCuatriActual = useMemo(() => {
    return new Set(materiasCuatriActual.map((cm) => cm.id))
  }, [materiasCuatriActual])

  const horariosCuatriActual = useMemo(() => {
    return horarios.filter((h) => materiaIdsCuatriActual.has(h.carrera_materia_id))
  }, [horarios, materiaIdsCuatriActual])

  const aniosDisponibles = useMemo(() => {
    const set = new Set()
    const maxPlanYears = carrera?.duracion || 3
    comisiones.forEach((c) => {
      for (let i = 0; i < maxPlanYears; i++) {
        set.add(c.anio_lectivo + i)
      }
    })
    if (set.size === 0) set.add(new Date().getFullYear())
    return Array.from(set).sort((a, b) => b - a)
  }, [comisiones, carrera])

  const comisionesCuatriActual = useMemo(() => {
    const semestre = semestreDeCuatri(cuatriActivo)
    const planYear = Math.ceil(cuatriActivo / 2)
    return comisiones.filter((c) => {
      if (c.semestre !== semestre) return false
      const anioCursando = c.anio_lectivo + planYear - 1
      if (filtroAnioLectivo && anioCursando !== parseInt(filtroAnioLectivo)) return false
      return true
    })
  }, [comisiones, cuatriActivo, filtroAnioLectivo])

  const comisionesSeleccionadas = useMemo(() => {
    return comisiones.filter((c) => selectedComisionIds.includes(c.id))
  }, [comisiones, selectedComisionIds])

  const materiasAsignadasComisionActiva = useMemo(() => {
    if (comisionesSeleccionadas.length === 0 && !comisionActiva) return []
    const target = comisionesSeleccionadas.length > 0 ? comisionesSeleccionadas : (comisionActiva ? [comisionActiva] : [])
    const materiaSet = new Map()
    target.forEach((com) => {
      (com.carrerasMaterias || []).forEach((cm) => {
        if (materiaIdsCuatriActual.has(cm.id)) {
          materiaSet.set(cm.id, cm)
        }
      })
    })
    return Array.from(materiaSet.values())
  }, [comisionActiva, comisionesSeleccionadas, materiaIdsCuatriActual])

  const materiaIdsAsignadas = useMemo(() => {
    return new Set(materiasAsignadasComisionActiva.map((cm) => cm.id))
  }, [materiasAsignadasComisionActiva])

  const targetComisionIds = useMemo(() => {
    if (selectedComisionIds.length > 0) return selectedComisionIds
    if (comisionActiva) return [comisionActiva.id]
    return []
  }, [selectedComisionIds, comisionActiva])

  const initBatchForm = useCallback(() => {
    const inicial = {}
    const targetId = targetComisionIds[0]
    materiasCuatriActual.forEach((cm) => {
      const existente = targetId ? horarios.find(
        (h) => h.carrera_materia_id === cm.id && h.comision_id === targetId
      ) : null
      inicial[cm.id] = {
        dia: existente?.dia || '',
        horario: existente?.horario || '',
        aula: existente?.aula || '',
        profesor: existente?.profesor || '',
      }
    })
    setBatchForm(inicial)
  }, [materiasCuatriActual, targetComisionIds, horarios])

  useEffect(() => {
    if (skipFormResetRef.current) {
      skipFormResetRef.current = false
      return
    }
    setErrores({})
    if (comisionesSeleccionadas.length > 0 || comisionActiva) {
      initBatchForm()
    } else {
      setBatchForm({})
    }
  }, [comisionActiva, comisionesSeleccionadas, initBatchForm])

  const eliminarComision = async (comisionId, comisionNombre) => {
    if (!confirm(`Eliminar comision ${comisionNombre} y todos sus horarios?`)) return
    try {
      await comisionesService.delete(comisionId)
      if (comisionActiva?.id === comisionId) setComisionActiva(null)
      setSelectedComisionIds((prev) => prev.filter((id) => id !== comisionId))
      mostrarExito('Comision eliminada.')
      await fetchComisiones()
      await fetchHorarios()
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al eliminar comision.')
    }
  }

  const asignarMateria = async (cmId) => {
    if (!comisionActiva) return
    try {
      await comisionesService.assignMaterias(comisionActiva.id, [cmId])
      await fetchComisiones()
      mostrarExito('Materia asignada a la comision.')
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al asignar materia.')
    }
  }

  const removerMateria = async (cmId) => {
    if (!comisionActiva) return
    try {
      await comisionesService.removeMateria(comisionActiva.id, cmId)
      await fetchComisiones()
      mostrarExito('Materia removida de la comision.')
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al remover materia.')
    }
  }

  const validarFila = useCallback((cmId, row) => {
    const errs = {}
    if (!row.dia) errs.dia = 'Selecciona un dia'
    if (!row.horario) errs.horario = 'Horario requerido'
    else if (!HORARIO_REGEX.test(row.horario)) errs.horario = 'Formato: HH:MM-HH:MM (ej: 18:00-20:00)'
    if (!esVirtual) {
      if (!row.aula) errs.aula = 'Aula requerida'
      else if (row.aula.length < 2) errs.aula = 'Minimo 2 caracteres'
    }
    if (row.profesor && row.profesor.length < 3) errs.profesor = 'Minimo 3 caracteres'
    return errs
  }, [esVirtual])

  const validarTodo = useCallback(() => {
    const nuevos = {}
    let ok = true
    Object.entries(batchForm).forEach(([cmId, row]) => {
      if (!row.dia && !row.horario) return
      const errs = validarFila(cmId, row)
      if (Object.keys(errs).length > 0) {
        nuevos[cmId] = errs
        ok = false
      }
    })
    setErrores(nuevos)
    return ok
  }, [batchForm, validarFila])

  const actualizarBatchField = (cmId, field, value) => {
    setBatchForm((prev) => {
      const next = { ...prev, [cmId]: { ...prev[cmId], [field]: value } }
      return next
    })
    setErrores((prev) => {
      if (!prev[cmId]) return prev
      const next = { ...prev }
      const restantes = { ...next[cmId] }
      delete restantes[field]
      if (Object.keys(restantes).length === 0) delete next[cmId]
      else next[cmId] = restantes
      return next
    })
  }

  const handleBlur = useCallback((cmId) => {
    const row = batchForm[cmId]
    if (!row) return
    if (!row.dia && !row.horario) return
    const errs = validarFila(cmId, row)
    setErrores((prev) => {
      if (Object.keys(errs).length === 0) {
        const next = { ...prev }
        delete next[cmId]
        return next
      }
      return { ...prev, [cmId]: errs }
    })
  }, [batchForm, validarFila])

  const cargarHorarios = async () => {
    if (targetComisionIds.length === 0) {
      mostrarBatchMsg('Selecciona o crea una comision primero.')
      return
    }

    if (!validarTodo()) {
      mostrarBatchMsg('Corrige los campos marcados en rojo antes de guardar.')
      return
    }

    setGuardandoBatch(true)

    // Auto-asignar materias a comisiones antes de guardar horarios
    for (const comisionId of targetComisionIds) {
      const com = comisiones.find((c) => c.id === comisionId)
      const assignedIds = new Set((com?.carrerasMaterias || []).map((cm) => cm.id))
      const neededIds = []
      for (const [cmId, row] of Object.entries(batchForm)) {
        if (!row.dia || !row.horario) continue
        if (!assignedIds.has(Number(cmId))) neededIds.push(Number(cmId))
      }
      if (neededIds.length > 0) {
        try {
          await comisionesService.assignMaterias(comisionId, neededIds)
        } catch {
          /* si falla la asignacion, el create del horario fallara despues */
        }
      }
    }

    let totalGuardados = 0
    let totalFallidos = 0
    const formSnapshot = {}

    for (const comisionId of targetComisionIds) {
      for (const [cmId, row] of Object.entries(batchForm)) {
        const { dia, horario, aula, profesor } = row
        if (!dia || !horario) continue
        const payload = {
          carrera_materia_id: Number(cmId),
          comision_id: comisionId,
          dia,
          horario,
          aula: esVirtual ? 'Virtual' : aula,
          profesor: profesor || undefined,
        }
        try {
          const existente = horarios.find(
            (h) => h.comision_id === comisionId && h.carrera_materia_id === Number(cmId)
          )
          if (existente) {
            await horariosService.update(existente.id, payload)
          } else {
            await horariosService.create(payload)
          }
          totalGuardados++
        } catch {
          totalFallidos++
          formSnapshot[cmId] = { ...row }
        }
      }
    }

    if (totalGuardados === 0 && totalFallidos === 0) {
      setGuardandoBatch(false)
      mostrarBatchMsg('Completa al menos dia y horario en alguna materia.')
      return
    }

    if (totalFallidos > 0 && Object.keys(formSnapshot).length > 0) {
      skipFormResetRef.current = true
    }

    if (totalFallidos === 0) {
      mostrarBatchMsg(`${totalGuardados} horario${totalGuardados !== 1 ? 's' : ''} guardado${totalGuardados !== 1 ? 's' : ''} correctamente.`)
    } else if (totalGuardados === 0) {
      mostrarBatchMsg('Error al guardar los horarios. Revisa los datos e intenta de nuevo.')
    } else {
      mostrarBatchMsg(`${totalGuardados} guardado${totalGuardados !== 1 ? 's' : ''}, ${totalFallidos} fallaron. Revisa los datos en las filas sin cambios.`)
    }

    setGuardandoBatch(false)
    await fetchHorarios()
  }

  const limpiarSeleccion = () => {
    setSelectedComisionIds([])
    setComisionActiva(null)
  }

  const abrirModalConCuatri = (c) => {
    setCuatriPrefijado(c)
    setBuscarModalOpen(true)
  }

  const cerrarModal = () => {
    setCuatriPrefijado(null)
    setBuscarModalOpen(false)
  }

  if (loading && !carrera) {
    return (
      <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!carrera) {
    return (
      <div className="p-4 md:p-8">
        <Link to="/admin/carreras" className="text-blue-600 hover:underline">&larr; Volver a Carreras</Link>
        <p className="text-gray-500 mt-4">Carrera no encontrada.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <Link to="/admin/carreras" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
        &larr; Volver a Carreras
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{carrera.nombre}</h1>
            <p className="text-sm text-gray-500 mt-1">{carrera.descripcion || 'Sin descripcion'}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {carrera.duracion && <span>{carrera.duracion} anos</span>}
            {carrera.modalidad && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                carrera.modalidad === 'presencial' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                carrera.modalidad === 'virtual' ? 'bg-green-50 text-green-600 border-green-100' :
                'bg-purple-50 text-purple-600 border-purple-100'
              }`}>
                {carrera.modalidad}
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              carrera.activa ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {carrera.activa ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >{tab.label}</button>
        ))}
      </div>

      {successMsg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${
          successMsg.includes('Error') || successMsg.includes('Completa')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {successMsg}
        </div>
      )}

      {activeTab === 'materias' && (
        <div className="space-y-4">
          {materiasPorCuatri.map(([cuatri, materias]) => (
            <div key={cuatri} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-blue-600 mb-3">
                {nombresCuatri[cuatri] || `Cuatrimestre ${cuatri}`}
              </h3>
              <div className="space-y-2">
                {materias.map((cm) => (
                  <div key={cm.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800 text-sm">{cm.materia?.nombre || '—'}</span>
                      {cm.carga_horaria_semanal && (
                        <span className="text-xs text-gray-400">{cm.carga_horaria_semanal}hs semanales</span>
                      )}
                    </div>
                    <button onClick={async () => {
                      if (!confirm('Desasignar esta materia?')) return
                      try {
                        await removeAsignacion(carrera.id, cm.id)
                        fetchCarreraById(id)
                        mostrarExito('Materia desasignada correctamente.')
                      } catch (err) {
                        mostrarExito(err.response?.data?.message || 'Error al desasignar la materia.')
                      }
                    }} className="text-xs font-semibold text-red-500 hover:text-red-700">Desasignar</button>
                  </div>
                ))}
              </div>
              <button onClick={() => abrirModalConCuatri(Number(cuatri))}
                className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >+ Agregar materia</button>
            </div>
          ))}

          {materiasPorCuatri.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">No hay materias asignadas a esta carrera.</p>
              <button onClick={() => abrirModalConCuatri(1)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
              >+ Agregar materia</button>
            </div>
          )}

          {cuatrimestresDisponibles.length < maxCuatri && (
            <button onClick={() => { fetchMaterias(); abrirModalConCuatri(proximoCuatri) }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800">
              + Agregar cuatrimestre
            </button>
          )}

          <BuscarMateriaModal
            isOpen={buscarModalOpen}
            onClose={cerrarModal}
            carreraId={carrera.id}
            onAsignada={() => fetchCarreraById(id)}
            maxCuatri={maxCuatri}
            cuatrimestrePrefijado={cuatriPrefijado}
          />
        </div>
      )}

      <Modal open={comisionFormOpen} onClose={() => setComisionFormOpen(false)}
        title="Nueva Comision" size="sm"
        footer={
          <>
            <button onClick={() => setComisionFormOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >Cancelar</button>
            <button onClick={handleCreateComision}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >Crear</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
            <input value={comisionFormData.nombre}
              onChange={(e) => setComisionFormData({ ...comisionFormData, nombre: e.target.value.toUpperCase().slice(0, 20) })}
              placeholder="Ej: A, B, 1, Mixta"
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Año de ingreso</label>
              <input type="number" value={comisionFormData.anio_lectivo}
                onChange={(e) => setComisionFormData({ ...comisionFormData, anio_lectivo: e.target.value })}
                min={2020} max={2030}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Semestre de ingreso</label>
              <select value={comisionFormData.semestre}
                onChange={(e) => setComisionFormData({ ...comisionFormData, semestre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Primer semestre</option>
                <option value={2}>Segundo semestre</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tutor <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select value={comisionFormData.encargado_id}
              onChange={(e) => setComisionFormData({ ...comisionFormData, encargado_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin tutor</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombre} {u.apellido} ({u.rol})</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {activeTab === 'horarios' && (
        <div className="space-y-4">
          {cuatrimestresDisponibles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">No hay materias asignadas a esta carrera. Asigna materias primero en la pestana Materias.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-1 flex-wrap">
                  {cuatrimestresDisponibles.map((c) => (
                    <button key={c} onClick={() => { setCuatriActivo(c); setComisionActiva(null); setSelectedComisionIds([]) }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        cuatriActivo === c
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {nombresCuatri[c] || `Cuatrimestre ${c}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                {comisionesLoading ? (
                  <div className="flex gap-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-700">Comisiones</h3>
                      <div className="flex items-center gap-2">
                        <select value={filtroAnioLectivo} onChange={(e) => setFiltroAnioLectivo(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {aniosDisponibles.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                        <button onClick={openComisionForm}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                        >+ Nueva Comision</button>
                        {selectedComisionIds.length > 0 && (
                          <button onClick={limpiarSeleccion}
                            className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-300"
                          >Limpiar seleccion</button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {comisionesCuatriActual.map((com) => {
                        const isSelected = selectedComisionIds.includes(com.id)
                        const isActive = comisionActiva?.id === com.id
                        return (
                          <div key={com.id} className="flex items-center gap-1">
                            <input type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleComisionSelection(com.id)}
                              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <button onClick={() => handleComisionClick(com)}
                              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                                isActive
                                  ? 'bg-blue-600 text-white shadow'
                                  : isSelected
                                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={`Comision ${com.nombre}${com.encargado ? ` — Tutor: ${com.encargado.nombre} ${com.encargado.apellido}` : ''}`}
                            >{com.nombre}</button>
                            <button onClick={() => eliminarComision(com.id, com.nombre)}
                              className="text-red-400 hover:text-red-600 text-xs font-bold ml-0.5"
                              title="Eliminar comision"
                            >&times;</button>
                          </div>
                        )
                      })}
                      {comisionesCuatriActual.length === 0 && (
                        <span className="text-xs text-gray-400">No hay comisiones para este semestre.</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {comisionesSeleccionadas.length > 0 || comisionActiva ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-700">
                      Materias — Cuatrimestre {cuatriActivo}
                      {comisionesSeleccionadas.length > 0
                        ? ` — ${comisionesSeleccionadas.length} comision${comisionesSeleccionadas.length !== 1 ? 'es' : ''}`
                        : ` — Comision ${comisionActiva.nombre}`
                      }
                    </h3>
                    {targetComisionIds.length > 1 && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded font-semibold">
                        Guardando en {targetComisionIds.length} comisiones
                      </span>
                    )}
                  </div>

                  {materiasCuatriActual.length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-gray-400 text-sm">No hay materias en este cuatrimestre.</p>
                    </div>
                  )}

                  {materiasCuatriActual.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Materia</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Dia</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Horario</th>
                              {!esVirtual && <th className="px-3 py-2 text-xs font-semibold text-gray-500">Aula</th>}
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Profesor</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {materiasCuatriActual.map((cm) => {
                              const row = batchForm[cm.id] || { dia: '', horario: '', aula: '', profesor: '', _id: null }
                              const isAssigned = materiaIdsAsignadas.has(cm.id)
                              return (
                                <tr key={cm.id} className={`border-b border-gray-100 ${isAssigned ? 'bg-white' : 'bg-gray-50/50'}`}>
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-1">
                                      <span className={`text-sm font-medium ${isAssigned ? 'text-gray-800' : 'text-gray-500'}`}>
                                        {isAssigned ? '' : '(Sin asignar) '}{cm.materia?.nombre}
                                      </span>
                                      {cm.carga_horaria_semanal && (
                                        <span className="text-xs text-gray-400 ml-1">({cm.carga_horaria_semanal}hs)</span>
                                      )}
                                      {isAssigned && (
                                        <button onClick={() => removerMateria(cm.id)}
                                          className="ml-1 text-red-400 hover:text-red-600 text-xs"
                                          title="Remover de esta comision"
                                        >&times;</button>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <select value={row.dia} onChange={(e) => actualizarBatchField(cm.id, 'dia', e.target.value)}
                                      onBlur={() => handleBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.dia ? 'border-red-400' : 'border-gray-300'}`}
                                    >
                                      <option value="">—</option>
                                      {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {errores[cm.id]?.dia && <p className="text-[10px] text-red-500 mt-0.5">{errores[cm.id].dia}</p>}
                                  </td>
                                  <td className="px-3 py-2">
                                    <input value={row.horario} onChange={(e) => actualizarBatchField(cm.id, 'horario', e.target.value)}
                                      onBlur={() => handleBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.horario ? 'border-red-400' : 'border-gray-300'}`}
                                      placeholder="18:00-20:00"
                                    />
                                    {errores[cm.id]?.horario && <p className="text-[10px] text-red-500 mt-0.5">{errores[cm.id].horario}</p>}
                                  </td>
                                  {!esVirtual && (
                                    <td className="px-3 py-2">
                                      <input value={row.aula} onChange={(e) => actualizarBatchField(cm.id, 'aula', e.target.value)}
                                        onBlur={() => handleBlur(cm.id)}
                                        className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.aula ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="Ej: 201"
                                      />
                                      {errores[cm.id]?.aula && <p className="text-[10px] text-red-500 mt-0.5">{errores[cm.id].aula}</p>}
                                    </td>
                                  )}
                                  <td className="px-3 py-2">
                                    <input value={row.profesor} onChange={(e) => actualizarBatchField(cm.id, 'profesor', e.target.value)}
                                      onBlur={() => handleBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.profesor ? 'border-red-400' : 'border-gray-300'}`}
                                      placeholder="Opcional"
                                    />
                                    {errores[cm.id]?.profesor && <p className="text-[10px] text-red-500 mt-0.5">{errores[cm.id].profesor}</p>}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      {batchMsg && (
                        <div className={`mb-3 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                          batchMsg.includes('fallaron') || batchMsg.startsWith('Error')
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {batchMsg}
                        </div>
                      )}
                      <div className="flex justify-end mt-4">
                        <button onClick={cargarHorarios} disabled={guardandoBatch}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition"
                        >{guardandoBatch ? 'Cargando...' : 'Cargar Horarios'}</button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center bg-gray-50 rounded-lg">
                      <p className="text-gray-400 text-sm">No hay materias en este cuatrimestre.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-400 text-sm">Selecciona o crea una comision para gestionar horarios.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CarreraDetailAdmin

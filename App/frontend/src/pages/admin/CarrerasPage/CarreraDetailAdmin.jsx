import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import useMateriasStore from '../../../stores/materiasStore'
import { horariosService } from '../../../services/horariosService'
import BuscarMateriaModal from './BuscarMateriaModal'

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
  const [comisionActiva, setComisionActiva] = useState('')
  const [nuevaComision, setNuevaComision] = useState('')
  const [comisionEditando, setComisionEditando] = useState(null)
  const [batchForm, setBatchForm] = useState({})
  const [errores, setErrores] = useState({})
  const [guardandoBatch, setGuardandoBatch] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const successTimer = useRef(null)
  const [batchMsg, setBatchMsg] = useState('')
  const batchTimer = useRef(null)
  const skipFormResetRef = useRef(false)

  useEffect(() => {
    if (id) fetchCarreraById(id)
  }, [id, fetchCarreraById])

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

  useEffect(() => {
    if (activeTab === 'horarios' && id) fetchHorarios()
  }, [activeTab, id, fetchHorarios])

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

  const horariosCuatriActual = useMemo(() => {
    const materiaIds = new Set(materiasCuatriActual.map((cm) => cm.id))
    return horarios.filter((h) => materiaIds.has(h.carrera_materia_id))
  }, [horarios, materiasCuatriActual])

  const comisiones = useMemo(() => {
    const set = new Set(horariosCuatriActual.map((h) => h.comision).filter(Boolean))
    return Array.from(set).sort()
  }, [horariosCuatriActual])

  const comisionesDisplay = useMemo(() => {
    const todas = new Set(comisiones)
    if (comisionActiva) todas.add(comisionActiva)
    return Array.from(todas).sort()
  }, [comisiones, comisionActiva])

  const initBatchForm = useCallback((horariosExistentes = []) => {
    const inicial = {}
    materiasCuatriActual.forEach((cm) => {
      const existente = horariosExistentes.find(h => h.carrera_materia_id === cm.id)
      inicial[cm.id] = {
        dia: existente?.dia || '',
        horario: existente?.horario || '',
        aula: existente?.aula || '',
        profesor: existente?.profesor || '',
        _id: existente?.id || null,
      }
    })
    setBatchForm(inicial)
  }, [materiasCuatriActual])

  useEffect(() => {
    if (skipFormResetRef.current) {
      skipFormResetRef.current = false
      return
    }
    setErrores({})
    if (comisionActiva) {
      const existentes = horariosCuatriActual.filter((h) => h.comision === comisionActiva)
      initBatchForm(existentes)
    } else {
      setBatchForm({})
    }
  }, [comisionActiva, initBatchForm, horariosCuatriActual])

  const agregarComision = () => {
    const letra = nuevaComision.trim().toUpperCase()
    if (!letra || letra.length !== 1) return
    setComisionActiva(letra)
    setNuevaComision('')
    setComisionEditando(null)
  }

  const eliminarComision = async () => {
    if (!confirm(`Eliminar comision ${comisionActiva} y todos sus horarios?`)) return
    const horariosAEliminar = horariosCuatriActual.filter((h) => h.comision === comisionActiva)
    for (const h of horariosAEliminar) {
      try { await horariosService.delete(h.id) } catch {}
    }
    setComisionActiva('')
    mostrarExito('Comision eliminada.')
    await fetchHorarios()
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
    if (!comisionActiva) {
      mostrarBatchMsg('Selecciona o crea una comision primero.')
      return
    }

    if (!validarTodo()) {
      mostrarBatchMsg('Corrige los campos marcados en rojo antes de guardar.')
      return
    }

    setGuardandoBatch(true)
    const guardados = []
    const fallidos = []
    const formSnapshot = {}

    for (const [cmId, row] of Object.entries(batchForm)) {
      const { dia, horario, aula, profesor, _id } = row
      const payload = {
        carrera_materia_id: Number(cmId),
        comision: comisionActiva,
        dia,
        horario,
        aula: esVirtual ? 'Virtual' : aula,
        profesor: profesor || undefined,
      }
      if (!dia || !horario) continue
      try {
        if (_id) {
          await horariosService.update(_id, payload)
          guardados.push({ cmId, id: _id })
        } else {
          const res = await horariosService.create(payload)
          const newId = res.data?.data?.id
          guardados.push({ cmId, id: newId })
        }
      } catch {
        fallidos.push(cmId)
        formSnapshot[cmId] = { ...row }
      }
    }

    if (guardados.length === 0 && fallidos.length === 0) {
      setGuardandoBatch(false)
      mostrarBatchMsg('Completa al menos dia y horario en alguna materia.')
      return
    }

    if (fallidos.length > 0) {
      setBatchForm((prev) => {
        const next = { ...prev }
        guardados.forEach(({ cmId, id }) => {
          if (next[cmId]) next[cmId] = { ...next[cmId], _id: id }
        })
        fallidos.forEach((cmId) => {
          if (formSnapshot[cmId]) next[cmId] = { ...formSnapshot[cmId] }
        })
        return next
      })
      skipFormResetRef.current = true
    }

    if (fallidos.length === 0) {
      mostrarBatchMsg(`${guardados.length} horario${guardados.length !== 1 ? 's' : ''} guardado${guardados.length !== 1 ? 's' : ''} correctamente.`)
    } else if (guardados.length === 0) {
      mostrarBatchMsg(`Error al guardar los horarios. Revisa los datos e intenta de nuevo.`)
    } else {
      mostrarBatchMsg(`${guardados.length} guardado${guardados.length !== 1 ? 's' : ''}, ${fallidos.length} fallaron. Revisa los datos en las filas sin cambios.`)
    }

    setGuardandoBatch(false)
    await fetchHorarios()
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
                    <button key={c} onClick={() => { setCuatriActivo(c); setComisionActiva(''); setComisionEditando(null) }}
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
                <h3 className="text-sm font-bold text-gray-700 mb-3">Comisiones del {nombresCuatri[cuatriActivo] || `Cuatrimestre ${cuatriActivo}`}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {comisionesDisplay.map((com) => (
                    <button key={com} onClick={() => { setComisionActiva(com); setComisionEditando(null) }}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        comisionActiva === com
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >{com}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input value={nuevaComision} onChange={(e) => setNuevaComision(e.target.value.toUpperCase().slice(0, 1))}
                    placeholder="Letra (ej: A)"
                    maxLength={1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 uppercase"
                    onKeyDown={(e) => { if (e.key === 'Enter') agregarComision() }}
                  />
                  <button onClick={agregarComision}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                  >Crear Comision</button>
                </div>
              </div>

              {comisionActiva ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-700">
                      Materias - {nombresCuatri[cuatriActivo] || `Cuatrimestre ${cuatriActivo}`} - Comision {comisionActiva}
                    </h3>
                    <button onClick={eliminarComision}
                      className="px-2.5 py-1 text-[10px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >Eliminar comision</button>
                  </div>

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
                          return (
                            <tr key={cm.id} className="border-b border-gray-100 bg-white">
                              <td className="px-3 py-2">
                                <span className="text-sm font-medium text-gray-800">{cm.materia?.nombre}</span>
                                {cm.carga_horaria_semanal && (
                                  <span className="text-xs text-gray-400 ml-1">({cm.carga_horaria_semanal}hs)</span>
                                )}
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
                                <div className="flex items-center gap-1">
                                  <input type="time" value={row.horario?.split('-')[0] || ''}
                                    onChange={(e) => actualizarBatchField(cm.id, 'horario', `${e.target.value}-${row.horario?.split('-')[1] || ''}`)}
                                    onBlur={() => handleBlur(cm.id)}
                                    className={`flex-1 min-w-0 px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.horario ? 'border-red-400' : 'border-gray-300'}`}
                                  />
                                  <span className="text-gray-400 text-xs font-bold">-</span>
                                  <input type="time" value={row.horario?.split('-')[1] || ''}
                                    onChange={(e) => actualizarBatchField(cm.id, 'horario', `${row.horario?.split('-')[0] || ''}-${e.target.value}`)}
                                    onBlur={() => handleBlur(cm.id)}
                                    className={`flex-1 min-w-0 px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[cm.id]?.horario ? 'border-red-400' : 'border-gray-300'}`}
                                  />
                                </div>
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
                              <td className="px-3 py-2"></td>
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

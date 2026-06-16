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

const cuatriDeComision = (nombre) => {
  const m = nombre.match(/^(\d+)/)
  return m ? parseInt(m[1]) : 1
}
const letraDeComision = (nombre) => nombre.replace(/^\d+/, '')

const CarreraDetailAdmin = () => {
  const { id } = useParams()
  const { selectedCarrera, loading, fetchCarreraById } = useCarrerasStore()
  const { fetchMaterias, addAsignacion, removeAsignacion } = useMateriasStore()
  const [activeTab, setActiveTab] = useState('materias')
  const [buscarModalOpen, setBuscarModalOpen] = useState(false)
  const [cuatriPrefijado, setCuatriPrefijado] = useState(null)
  const [horarios, setHorarios] = useState([])

  const [semestreActivo, setSemestreActivo] = useState(1)
  const [cuatriActivo, setCuatriActivo] = useState(1)
  const [comisiones, setComisiones] = useState([])
  const [comisionesLoading, setComisionesLoading] = useState(false)
  const [selectedNombres, setSelectedNombres] = useState(new Set())
  const [comisionFormOpen, setComisionFormOpen] = useState(false)
  const [comisionFormData, setComisionFormData] = useState({ cuatrimestre: 1, letra: '', encargado_id: '' })
  const [filtroAnioLectivo, setFiltroAnioLectivo] = useState('2026')
  const [formsPorComision, setFormsPorComision] = useState({})
  const [errores, setErrores] = useState({})
  const [guardandoBatch, setGuardandoBatch] = useState(false)
  const [creando, setCreando] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const successTimer = useRef(null)
  const [batchMsg, setBatchMsg] = useState('')
  const batchTimer = useRef(null)
  const [sharedFormData, setSharedFormData] = useState({})
  const [sharedErrores, setSharedErrores] = useState({})
  const [pristineForms, setPristineForms] = useState({})

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
    try {
      const res = await horariosService.getAll({ carrera_id: parseInt(id) })
      setHorarios(res.data?.data || res.data || [])
    } catch {
      setHorarios([])
    }
  }, [id])

  const fetchComisiones = useCallback(async () => {
    if (!id) return
    setComisionesLoading(true)
    try {
      const res = await comisionesService.getAll({ carrera_id: parseInt(id) })
      const data = res.data?.data || res.data || []
      setComisiones(data)
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

  const toggleComision = (nombre) => {
    setSelectedNombres((prev) => {
      const next = new Set(prev)
      if (next.has(nombre)) next.delete(nombre)
      else next.add(nombre)
      return next
    })
  }

  const openComisionForm = () => {
    setComisionFormData({
      cuatrimestre: cuatriActivo,
      letra: '',
      encargado_id: '',
    })
    setComisionFormOpen(true)
  }

  const handleCreateComision = async () => {
    const { cuatrimestre, letra, encargado_id } = comisionFormData
    const letras = letra
      .split(',')
      .map((l) => l.trim().toUpperCase())
      .filter((l) => l.length > 0)
    if (letras.length === 0) return

    const semestre = ((cuatrimestre - 1) % 2) + 1
    setCreando(true)

    let creadas = 0
    const erroresLista = []
    for (const l of letras) {
      const nombre = `${cuatrimestre}${l}`
      try {
        const payload = {
          carrera_id: parseInt(id),
          nombre,
          anio_lectivo: parseInt(filtroAnioLectivo),
          semestre,
        }
        if (encargado_id) payload.encargado_id = parseInt(encargado_id)

        const res = await comisionesService.create(payload)
        const comisionId = res.data?.data?.id || res.data?.id

        const materiaIds = (carrera?.carreraMaterias || [])
          .filter((cm) => cm.cuatrimestre === cuatrimestre)
          .map((cm) => cm.id)

        if (materiaIds.length > 0 && comisionId) {
          await comisionesService.assignMaterias(comisionId, materiaIds)
        }
        creadas++
      } catch (err) {
        const backendMsg = err.response?.data?.message || ''
        if (backendMsg.toLowerCase().includes('unique') || backendMsg.toLowerCase().includes('ya existe')) {
          erroresLista.push(`"${nombre}" ya existe`)
        } else {
          erroresLista.push(`"${nombre}": ${err.response?.data?.message || 'Error de conexion'}`)
        }
      }
    }

    setComisionFormOpen(false)
    await fetchComisiones()
    if (erroresLista.length === 0) {
      mostrarExito(`${creadas} comision${creadas !== 1 ? 'es' : ''} creada${creadas !== 1 ? 's' : ''} y materias vinculadas.`)
    } else {
      const ok = creadas > 0 ? ` (${creadas} creada${creadas !== 1 ? 's' : ''})` : ''
      mostrarExito(`Error: ${erroresLista.join('; ')}${ok}`)
    }
    setCreando(false)
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

  const cuatrimestresDelSemestre = useMemo(() => {
    return cuatrimestresDisponibles.filter((c) => ((c - 1) % 2) + 1 === semestreActivo)
  }, [cuatrimestresDisponibles, semestreActivo])

  useEffect(() => {
    if (activeTab === 'horarios' && cuatrimestresDelSemestre.length > 0 && !cuatrimestresDelSemestre.includes(cuatriActivo)) {
      setCuatriActivo(cuatrimestresDelSemestre[0])
    }
  }, [activeTab, cuatrimestresDelSemestre, cuatriActivo])

  useEffect(() => {
    if (cuatrimestresDelSemestre.length > 0 && !cuatrimestresDelSemestre.includes(cuatriActivo)) {
      setCuatriActivo(cuatrimestresDelSemestre[0])
    }
  }, [semestreActivo, cuatrimestresDelSemestre, cuatriActivo])

  useEffect(() => {
    setSelectedNombres(new Set())
  }, [cuatriActivo])

  const materiasCuatriActual = useMemo(() => {
    return carrera?.carreraMaterias?.filter((cm) => (cm.cuatrimestre || 1) === cuatriActivo) || []
  }, [carrera, cuatriActivo])

  const materiaIdsCuatriActual = useMemo(() => {
    return new Set(materiasCuatriActual.map((cm) => cm.id))
  }, [materiasCuatriActual])

  const aniosDisponibles = useMemo(() => {
  const años = [];
  // Arranca en 2026 y sube hasta el 2040
  for (let a = 2026; a <= 2040; a++) {
    años.push(a);
  }
  // Los ordena de menor a mayor para que el 2026 quede primero
  return años.sort((a, b) => a - b);
}, []);

  const comisionesDelCuatri = useMemo(() => {
    return comisiones.filter((c) => cuatriDeComision(c.nombre) === cuatriActivo && c.anio_lectivo === parseInt(filtroAnioLectivo))
  }, [comisiones, cuatriActivo, filtroAnioLectivo])

  const comisionesSeleccionadas = useMemo(() => {
    return comisiones.filter((c) => selectedNombres.has(c.nombre) && cuatriDeComision(c.nombre) === cuatriActivo && c.anio_lectivo === parseInt(filtroAnioLectivo))
  }, [comisiones, selectedNombres, cuatriActivo, filtroAnioLectivo])

  const registrosDeComision = useCallback((nombre, semestre) => {
    return comisiones.find((c) => c.nombre === nombre && c.semestre === semestre && c.anio_lectivo === parseInt(filtroAnioLectivo))
  }, [comisiones, filtroAnioLectivo])

  const materiaIdsAsignadasPorNombre = useMemo(() => {
    const porNombre = {}
    comisionesSeleccionadas.forEach((c) => {
      porNombre[c.nombre] = new Set((c.carrerasMaterias || []).map((cm) => cm.id))
    })
    return porNombre
  }, [comisionesSeleccionadas])

  const horariosPorComision = useMemo(() => {
    const porComision = {}
    comisionesSeleccionadas.forEach((c) => {
      porComision[c.nombre] = porComision[c.nombre] || []
      horarios.filter((h) => h.comision_id === c.id).forEach((h) => {
        porComision[c.nombre].push(h)
      })
    })
    return porComision
  }, [comisionesSeleccionadas, horarios])

  const modoCompartido = useMemo(() => {
    if (selectedNombres.size === 0) return false
    return Array.from(selectedNombres).every((nombre) => {
      const horariosDeEsta = horariosPorComision[nombre] || []
      return horariosDeEsta.length === 0
    })
  }, [selectedNombres, horariosPorComision])

  const borrarHorario = async (nombre, cmId) => {
    const horariosDeEsta = horariosPorComision[nombre] || []
    const h = horariosDeEsta.find((x) => x.carrera_materia_id === cmId)
    if (!h) return
    if (!confirm('Eliminar este horario?')) return
    try {
      await horariosService.delete(h.id)
      mostrarExito('Horario eliminado.')
      await fetchHorarios()
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al eliminar horario.')
    }
  }

  const initFormsPorComision = useCallback(() => {
    const inicial = {}
    const pristine = {}
    selectedNombres.forEach((nombre) => {
      const sem = ((cuatriActivo - 1) % 2) + 1
      const reg = registrosDeComision(nombre, sem)
      const formsMaterias = {}
      const pristineMaterias = {}
      materiasCuatriActual.forEach((cm) => {
        const existente = reg ? horarios.find(
          (h) => h.carrera_materia_id === cm.id && h.comision_id === reg.id
        ) : null
        const horarioStr = existente?.horario || ''
        const partes = horarioStr.split('-')
        const values = {
          dia: existente?.dia || '',
          horario: horarioStr,
          horario_inicio: partes[0] || '',
          horario_fin: partes[1] || '',
          aula: existente?.aula || '',
          profesor: existente?.profesor || '',
        }
        formsMaterias[cm.id] = { ...values }
        pristineMaterias[cm.id] = { ...values }
      })
      inicial[nombre] = formsMaterias
      pristine[nombre] = pristineMaterias
    })
    setFormsPorComision(inicial)
    setPristineForms(pristine)
  }, [materiasCuatriActual, selectedNombres, horarios, cuatriActivo, registrosDeComision])

  useEffect(() => {
    setErrores({})
    setSharedErrores({})
    if (selectedNombres.size > 0) {
      if (modoCompartido) {
        const inicial = {}
        materiasCuatriActual.forEach((cm) => {
          inicial[cm.id] = { dia: '', horario: '', horario_inicio: '', horario_fin: '', aula: '', profesor: '' }
        })
        setSharedFormData(inicial)
        setFormsPorComision({})
      } else {
        initFormsPorComision()
        setSharedFormData({})
      }
    } else {
      setFormsPorComision({})
      setSharedFormData({})
      setPristineForms({})
    }
  }, [selectedNombres, initFormsPorComision, modoCompartido, materiasCuatriActual])

  const eliminarComision = async (nombre) => {
    if (!confirm(`Eliminar comision ${nombre} y sus horarios?`)) return
    const registros = comisiones.filter((c) => c.nombre === nombre && c.anio_lectivo === parseInt(filtroAnioLectivo))
    if (registros.length === 0) return
    try {
      for (const reg of registros) {
        const res = await horariosService.getAll({ comision_id: reg.id })
        const horariosBorrar = res.data?.data || res.data || []
        for (const h of horariosBorrar) {
          await horariosService.delete(h.id)
        }
        await comisionesService.delete(reg.id)
      }
      setSelectedNombres((prev) => { const next = new Set(prev); next.delete(nombre); return next })
      mostrarExito(`Comision ${nombre} y horarios eliminados.`)
      await fetchComisiones()
      await fetchHorarios()
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al eliminar.')
    }
  }

  const removerMateriaDeComision = async (nombre, cmId) => {
    const sem = ((cuatriActivo - 1) % 2) + 1
    const reg = registrosDeComision(nombre, sem)
    if (!reg) return
    try {
      await comisionesService.removeMateria(reg.id, cmId)
      await fetchComisiones()
      mostrarExito(`Materia removida de ${nombre}.`)
    } catch (err) {
      mostrarExito(err.response?.data?.message || 'Error al remover materia.')
    }
  }

  const validarFila = useCallback((cmId, row) => {
    const errs = {}
    if (!row.dia) errs.dia = 'Selecciona un dia'
    if (!row.horario_inicio) errs.horario_inicio = 'Selecciona inicio'
    if (!row.horario_fin) errs.horario_fin = 'Selecciona fin'
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
    Object.entries(formsPorComision).forEach(([nombre, materias]) => {
      Object.entries(materias).forEach(([cmId, row]) => {
        if (!row.dia && !row.horario_inicio && !row.horario_fin) return
        const errs = validarFila(cmId, row)
        if (Object.keys(errs).length > 0) {
          nuevos[nombre] = { ...(nuevos[nombre] || {}), [cmId]: errs }
          ok = false
        }
      })
    })
    setErrores(nuevos)
    return ok
  }, [formsPorComision, validarFila])

  const actualizarComisionField = (nombre, cmId, field, value) => {
    setFormsPorComision((prev) => {
      const materias = { ...(prev[nombre] || {}) }
      const current = { ...(materias[cmId] || {}) }
      const next = { ...current, [field]: value }
      if (field === 'horario_inicio' || field === 'horario_fin') {
        const inicio = field === 'horario_inicio' ? value : next.horario_inicio
        const fin = field === 'horario_fin' ? value : next.horario_fin
        next.horario = inicio && fin ? `${inicio}-${fin}` : ''
      }
      materias[cmId] = next
      return { ...prev, [nombre]: materias }
    })
  }

  const handleBlur = useCallback((nombre, cmId) => {
    const row = formsPorComision[nombre]?.[cmId]
    if (!row) return
    if (!row.dia && !row.horario) return
    const errs = validarFila(cmId, row)
    if (Object.keys(errs).length === 0) {
      setErrores((prev) => {
        const next = { ...prev }
        const porNombre = { ...(next[nombre] || {}) }
        delete porNombre[cmId]
        next[nombre] = porNombre
        return next
      })
    } else {
      setErrores((prev) => ({
        ...prev,
        [nombre]: { ...(prev[nombre] || {}), [cmId]: errs },
      }))
    }
  }, [formsPorComision, validarFila])

  const cargarHorarios = async () => {
    if (selectedNombres.size === 0) {
      mostrarBatchMsg('Selecciona o crea una comision primero.')
      return
    }

    if (!validarTodo()) {
      mostrarBatchMsg('Corrige los campos marcados en rojo antes de guardar.')
      return
    }

    setGuardandoBatch(true)

    const sem = ((cuatriActivo - 1) % 2) + 1
    let totalGuardados = 0
    let totalFallidos = 0
    let huboDatos = false

    for (const nombre of selectedNombres) {
      const reg = registrosDeComision(nombre, sem)
      if (!reg) continue

      const materiasForm = formsPorComision[nombre] || {}

      const assignedIds = new Set((reg.carrerasMaterias || []).map((cm) => cm.id))
      const neededIds = []
      for (const [cmId, row] of Object.entries(materiasForm)) {
        if (!row.dia || !row.horario_inicio || !row.horario_fin) continue
        if (!assignedIds.has(Number(cmId))) neededIds.push(Number(cmId))
      }
      if (neededIds.length > 0) {
        try {
          await comisionesService.assignMaterias(reg.id, neededIds)
        } catch { /* ok */ }
      }

      for (const [cmId, row] of Object.entries(materiasForm)) {
        const { dia, horario: horarioCombinado, horario_inicio, horario_fin, aula, profesor } = row
        const horario = horarioCombinado || (horario_inicio && horario_fin ? `${horario_inicio}-${horario_fin}` : '')
        if (!dia || !horario) continue
        huboDatos = true
        const payload = {
          carrera_materia_id: Number(cmId),
          comision_id: reg.id,
          dia,
          horario,
          aula: esVirtual ? 'Virtual' : aula,
          profesor: profesor || undefined,
        }
        try {
          const existente = horarios.find(
            (h) => h.comision_id === reg.id && h.carrera_materia_id === Number(cmId)
          )
          if (existente) {
            await horariosService.update(existente.id, payload)
          } else {
            await horariosService.create(payload)
          }
          totalGuardados++
        } catch {
          totalFallidos++
        }
      }
    }

    if (!huboDatos) {
      setGuardandoBatch(false)
      mostrarBatchMsg('Completa al menos dia y horario en alguna materia.')
      return
    }

    if (totalFallidos === 0) {
      mostrarBatchMsg(`${totalGuardados} horario${totalGuardados !== 1 ? 's' : ''} guardado${totalGuardados !== 1 ? 's' : ''} correctamente.`)
    } else if (totalGuardados === 0) {
      mostrarBatchMsg('Error al guardar los horarios.')
    } else {
      mostrarBatchMsg(`${totalGuardados} guardado${totalGuardados !== 1 ? 's' : ''}, ${totalFallidos} fallaron.`)
    }

    setGuardandoBatch(false)
    await fetchHorarios()
  }

  const guardarHorariosDeComision = useCallback(async (nombre) => {
    const sem = ((cuatriActivo - 1) % 2) + 1
    const reg = registrosDeComision(nombre, sem)
    if (!reg) return { guardados: 0, fallidos: 0, huboDatos: false }

    const materiasForm = formsPorComision[nombre] || {}

    const assignedIds = new Set((reg.carrerasMaterias || []).map((cm) => cm.id))
    const neededIds = []
    for (const [cmId, row] of Object.entries(materiasForm)) {
      if (!row.dia || !row.horario_inicio || !row.horario_fin) continue
      if (!assignedIds.has(Number(cmId))) neededIds.push(Number(cmId))
    }
    if (neededIds.length > 0) {
      try { await comisionesService.assignMaterias(reg.id, neededIds) } catch { /* ok */ }
    }

    let guardados = 0
    let fallidos = 0
    let huboDatos = false

    for (const [cmId, row] of Object.entries(materiasForm)) {
      const { dia, horario: horarioCombinado, horario_inicio, horario_fin, aula, profesor } = row
      const horario = horarioCombinado || (horario_inicio && horario_fin ? `${horario_inicio}-${horario_fin}` : '')
      if (!dia || !horario) continue
      huboDatos = true
      const payload = {
        carrera_materia_id: Number(cmId),
        comision_id: reg.id,
        dia,
        horario,
        aula: esVirtual ? 'Virtual' : aula,
        profesor: profesor || undefined,
      }
      try {
        const existente = horarios.find((h) => h.comision_id === reg.id && h.carrera_materia_id === Number(cmId))
        if (existente) await horariosService.update(existente.id, payload)
        else await horariosService.create(payload)
        guardados++
      } catch { fallidos++ }
    }

    return { guardados, fallidos, huboDatos }
  }, [cuatriActivo, registrosDeComision, formsPorComision, esVirtual, horarios])

  const comisionEstaDirty = useCallback((nombre) => {
    const current = formsPorComision[nombre] || {}
    const pristine = pristineForms[nombre] || {}
    return Object.keys(current).some((cmId) => {
      const cur = current[cmId]
      const pri = pristine[cmId]
      if (!pri) return Object.values(cur).some(v => v)
      return ['dia', 'horario_inicio', 'horario_fin', 'aula', 'profesor'].some(
        (f) => (cur[f] || '') !== (pri[f] || '')
      )
    })
  }, [formsPorComision, pristineForms])

  const cargarHorariosComision = async (nombre) => {
    if (!validarTodo()) {
      mostrarBatchMsg('Corrige los campos marcados en rojo antes de guardar.')
      return
    }

    setGuardandoBatch(true)

    const comisionesAGuardar = Array.from(selectedNombres).filter(
      (nom) => nom === nombre || comisionEstaDirty(nom)
    )

    let totalGuardados = 0
    let totalFallidos = 0
    let huboDatosGlobal = false
    const comisionesConDatos = []

    for (const nom of comisionesAGuardar) {
      const result = await guardarHorariosDeComision(nom)
      totalGuardados += result.guardados
      totalFallidos += result.fallidos
      if (result.huboDatos) {
        huboDatosGlobal = true
        comisionesConDatos.push(nom)
      }
    }

    if (!huboDatosGlobal) {
      setGuardandoBatch(false)
      mostrarBatchMsg('Completa al menos dia y horario en alguna materia.')
      return
    }

    if (totalFallidos === 0) {
      mostrarBatchMsg(`${totalGuardados} horario${totalGuardados !== 1 ? 's' : ''} guardado${totalGuardados !== 1 ? 's' : ''} correctamente en ${comisionesConDatos.length} comision${comisionesConDatos.length !== 1 ? 'es' : ''}.`)
    } else if (totalGuardados === 0) {
      mostrarBatchMsg('Error al guardar los horarios.')
    } else {
      mostrarBatchMsg(`${totalGuardados} guardado${totalGuardados !== 1 ? 's' : ''}, ${totalFallidos} fallaron.`)
    }

    setGuardandoBatch(false)
    await fetchHorarios()
    setTimeout(() => setBatchMsg(''), 3000)
  }

  const actualizarSharedField = (cmId, field, value) => {
    setSharedFormData((prev) => {
      const current = { ...(prev[cmId] || {}) }
      const next = { ...current, [field]: value }
      if (field === 'horario_inicio' || field === 'horario_fin') {
        const inicio = field === 'horario_inicio' ? value : next.horario_inicio
        const fin = field === 'horario_fin' ? value : next.horario_fin
        next.horario = inicio && fin ? `${inicio}-${fin}` : ''
      }
      return { ...prev, [cmId]: next }
    })
  }

  const handleSharedBlur = (cmId) => {
    const row = sharedFormData[cmId]
    if (!row) return
    if (!row.dia && !row.horario) return
    const err = validarFila(Number(cmId), row)
    if (Object.keys(err).length === 0) {
      setSharedErrores((prev) => { const n = { ...prev }; delete n[cmId]; return n })
    } else {
      setSharedErrores((prev) => ({ ...prev, [cmId]: err }))
    }
  }

  const validarCompartido = () => {
    const errs = {}
    let ok = true
    Object.entries(sharedFormData).forEach(([cmId, row]) => {
      if (!row.dia && !row.horario_inicio && !row.horario_fin) return
      const err = validarFila(Number(cmId), row)
      if (Object.keys(err).length > 0) { errs[cmId] = err; ok = false }
    })
    setSharedErrores(errs)
    return ok
  }

  const guardarCompartido = async () => {
    if (!validarCompartido()) {
      mostrarBatchMsg('Corrige los campos marcados en rojo antes de guardar.')
      return
    }

    setGuardandoBatch(true)
    const sem = ((cuatriActivo - 1) % 2) + 1
    let totalGuardados = 0
    let totalFallidos = 0
    let huboDatos = false

    for (const nombre of selectedNombres) {
      const reg = registrosDeComision(nombre, sem)
      if (!reg) continue

      const assignedIds = new Set((reg.carrerasMaterias || []).map((cm) => cm.id))
      const neededIds = []
      for (const [cmId, row] of Object.entries(sharedFormData)) {
        if (!row.dia || !row.horario_inicio || !row.horario_fin) continue
        if (!assignedIds.has(Number(cmId))) neededIds.push(Number(cmId))
      }
      if (neededIds.length > 0) {
        try { await comisionesService.assignMaterias(reg.id, neededIds) } catch { /* ok */ }
      }

      for (const [cmId, row] of Object.entries(sharedFormData)) {
        const { dia, horario: horarioCombinado, horario_inicio, horario_fin, aula, profesor } = row
        const horario = horarioCombinado || (horario_inicio && horario_fin ? `${horario_inicio}-${horario_fin}` : '')
        if (!dia || !horario) continue
        huboDatos = true
        const payload = {
          carrera_materia_id: Number(cmId),
          comision_id: reg.id,
          dia,
          horario,
          aula: esVirtual ? 'Virtual' : aula,
          profesor: profesor || undefined,
        }
        try {
          const existente = horarios.find((h) => h.comision_id === reg.id && h.carrera_materia_id === Number(cmId))
          if (existente) await horariosService.update(existente.id, payload)
          else await horariosService.create(payload)
          totalGuardados++
        } catch { totalFallidos++ }
      }
    }

    if (!huboDatos) {
      setGuardandoBatch(false)
      mostrarBatchMsg('Completa al menos dia y horario en alguna materia.')
      return
    }

    if (totalFallidos === 0) {
      mostrarBatchMsg(`${totalGuardados} horario${totalGuardados !== 1 ? 's' : ''} guardado${totalGuardados !== 1 ? 's' : ''} correctamente en ${selectedNombres.size} comision${selectedNombres.size !== 1 ? 'es' : ''}.`)
    } else if (totalGuardados === 0) {
      mostrarBatchMsg('Error al guardar los horarios.')
    } else {
      mostrarBatchMsg(`${totalGuardados} guardado${totalGuardados !== 1 ? 's' : ''}, ${totalFallidos} fallaron.`)
    }

    setGuardandoBatch(false)
    await fetchHorarios()
  }

  const limpiarSeleccion = () => {
    setSelectedNombres(new Set())
  }

  const toggleTodas = () => {
    const todas = new Set(comisionesDelCuatri.map((c) => c.nombre))
    setSelectedNombres((prev) => {
      if (prev.size === todas.size && [...prev].every((n) => todas.has(n))) {
        return new Set()
      }
      return todas
    })
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
          successMsg.includes('Error') || successMsg.includes('Completa') || successMsg.includes('ya existe')
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
            <button onClick={handleCreateComision} disabled={creando}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >{creando ? 'Creando...' : 'Crear'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Cuatrimestre: <strong>{nombresCuatri[comisionFormData.cuatrimestre] || `Cuatrimestre ${comisionFormData.cuatrimestre}`}</strong> ({comisionFormData.cuatrimestre})
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Letras</label>
            <input value={comisionFormData.letra}
              onChange={(e) => setComisionFormData({ ...comisionFormData, letra: e.target.value.toUpperCase().replace(/[^A-Z,]/g, '') })}
              placeholder="Ej: A, B, C"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Se crear{comisionFormData.letra.includes(',') ? 'án' : 'á'}: <strong>{comisionFormData.letra.split(',').filter(l => l.trim()).map(l => `${comisionFormData.cuatrimestre}${l.trim().toUpperCase()}`).join(', ') || `${comisionFormData.cuatrimestre}?`}</strong>
            </p>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex items-start gap-2">
                    <label className="text-xs font-semibold text-gray-500 mt-1.5">Año lectivo:</label>
                    <select value={filtroAnioLectivo} onChange={(e) => setFiltroAnioLectivo(e.target.value)}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {aniosDisponibles.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {cuatrimestresDisponibles.map((c) => {
                    const activo = cuatrimestresDelSemestre.includes(c)
                    return (
                      <button key={c} onClick={() => {
                        if (!activo) {
                          const sem = ((c - 1) % 2) + 1
                          setSemestreActivo(sem)
                        }
                        setCuatriActivo(c)
                      }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          cuatriActivo === c
                            ? 'bg-blue-600 text-white'
                            : activo
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >{nombresCuatri[c] || `C${c}`}</button>
                    )
                  })}
                </div>
              </div>
            </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-700">Comisiones — {nombresCuatri[cuatriActivo] || `Cuatrimestre ${cuatriActivo}`}</h3>
                  <div className="flex items-center gap-2">
                    {selectedNombres.size > 0 && (
                      <button onClick={limpiarSeleccion}
                        className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-300"
                      >Limpiar</button>
                    )}
                    <button onClick={openComisionForm}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                    >+ Nueva Comision</button>
                  </div>
                </div>
                {comisionesLoading ? (
                  <div className="flex gap-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                    ))}
                  </div>
                ) : comisionesDelCuatri.length === 0 ? (
                  <div className="flex flex-col items-center gap-1 py-4">
                    <span className="text-sm text-gray-400">No hay comisiones para este cuatrimestre. Creá una nueva.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {comisionesDelCuatri.length > 0 && (
                      <button onClick={toggleTodas}
                        className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-300"
                      >{selectedNombres.size === comisionesDelCuatri.length ? 'Deseleccionar todas' : 'Todas'}</button>
                    )}
                    {comisionesDelCuatri.map((c) => {
                      const nombreCompleto = c.nombre
                      const letra = letraDeComision(nombreCompleto)
                      const isSelected = selectedNombres.has(nombreCompleto)
                      const tutor = c.encargado
                      return (
                        <div key={c.id} className="flex items-center gap-1">
                          <button onClick={() => toggleComision(nombreCompleto)}
                            className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={`Comision ${letra}${tutor ? ` — Tutor: ${tutor.nombre} ${tutor.apellido}` : ''}`}
                          >{letra}</button>
                          <button onClick={() => eliminarComision(nombreCompleto)}
                            className="text-red-400 hover:text-red-600 text-xs font-bold ml-0.5"
                            title="Eliminar comision"
                          >&times;</button>
                        </div>
                      )
                    })}
                    {selectedNombres.size === 0 && (
                      <span className="text-[10px] text-gray-400 ml-1 italic">Hacé clic en una comisión para cargar horarios</span>
                    )}
                  </div>
                )}
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

              {selectedNombres.size > 0 && comisionesDelCuatri.length > 0 ? (
                modoCompartido ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-gray-700">
                        Horarios — Compartido ({selectedNombres.size} comisiones)
                        <span className="text-gray-400 font-normal ml-2">
                          ({nombresCuatri[cuatriActivo] || `Cuatrimestre ${cuatriActivo}`})
                        </span>
                      </h3>
                      <button onClick={guardarCompartido} disabled={guardandoBatch}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg transition"
                      >{guardandoBatch ? 'Guardando...' : 'Guardar Horarios'}</button>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">Modo compartido: los horarios se aplicarán a las {selectedNombres.size} comisiones seleccionadas.</p>

                    {materiasCuatriActual.length === 0 ? (
                      <p className="text-gray-400 text-sm">No hay materias en este cuatrimestre.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Materia</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Día</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Inicio</th>
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Fin</th>
                              {!esVirtual && <th className="px-3 py-2 text-xs font-semibold text-gray-500">Aula</th>}
                              <th className="px-3 py-2 text-xs font-semibold text-gray-500">Profesor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materiasCuatriActual.map((cm) => {
                              const row = sharedFormData[cm.id] || { dia: '', horario: '', aula: '', profesor: '' }
                              return (
                                <tr key={cm.id} className="border-b border-gray-100">
                                  <td className="px-3 py-2">
                                    <span className="text-sm font-medium text-gray-800">{cm.materia?.nombre}</span>
                                    {cm.carga_horaria_semanal && (
                                      <span className="text-xs text-gray-400 ml-1">({cm.carga_horaria_semanal}hs)</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    <select value={row.dia} onChange={(e) => actualizarSharedField(cm.id, 'dia', e.target.value)}
                                      onBlur={() => handleSharedBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${sharedErrores[cm.id]?.dia ? 'border-red-400' : 'border-gray-300'}`}
                                    >
                                      <option value="">—</option>
                                      {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                  </td>
                                  <td className="px-3 py-2">
                                    <input type="time" value={row.horario_inicio || ''}
                                      onChange={(e) => actualizarSharedField(cm.id, 'horario_inicio', e.target.value)}
                                      onBlur={() => handleSharedBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${sharedErrores[cm.id]?.horario_inicio ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                  </td>
                                  <td className="px-3 py-2">
                                    <input type="time" value={row.horario_fin || ''}
                                      onChange={(e) => actualizarSharedField(cm.id, 'horario_fin', e.target.value)}
                                      onBlur={() => handleSharedBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${sharedErrores[cm.id]?.horario_fin ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                  </td>
                                  {!esVirtual && (
                                    <td className="px-3 py-2">
                                      <input value={row.aula} onChange={(e) => actualizarSharedField(cm.id, 'aula', e.target.value)}
                                        onBlur={() => handleSharedBlur(cm.id)}
                                        className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${sharedErrores[cm.id]?.aula ? 'border-red-400' : 'border-gray-300'}`}
                                        placeholder="Ej: 201"
                                      />
                                    </td>
                                  )}
                                  <td className="px-3 py-2">
                                    <input value={row.profesor} onChange={(e) => actualizarSharedField(cm.id, 'profesor', e.target.value)}
                                      onBlur={() => handleSharedBlur(cm.id)}
                                      className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${sharedErrores[cm.id]?.profesor ? 'border-red-400' : 'border-gray-300'}`}
                                      placeholder="Opcional"
                                    />
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.from(selectedNombres).sort().map((nombre) => {
                      const materiasForm = formsPorComision[nombre] || {}
                      const materiaIdsAsignadas = materiaIdsAsignadasPorNombre[nombre] || new Set()
                      const horariosDeEsta = horariosPorComision[nombre] || []
                      return (
                        <div key={nombre} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-gray-700">
                              Horarios — Comisión {letraDeComision(nombre)}
                              <span className="text-gray-400 font-normal ml-2">
                                ({nombresCuatri[cuatriActivo] || `Cuatrimestre ${cuatriActivo}`})
                              </span>
                            </h3>
                            <button onClick={() => cargarHorariosComision(nombre)} disabled={guardandoBatch}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-lg transition"
                            >{guardandoBatch ? 'Guardando...' : 'Guardar Horarios'}</button>
                          </div>
                          <p className="text-[10px] text-gray-400 mb-3">Completá día, horario inicio/fin y aula. Profesor es opcional.</p>

                          {materiasCuatriActual.length === 0 ? (
                            <p className="text-gray-400 text-sm">No hay materias en este cuatrimestre.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500">Materia</th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500">Día</th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500">Inicio</th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500">Fin</th>
                                    {!esVirtual && <th className="px-3 py-2 text-xs font-semibold text-gray-500">Aula</th>}
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500">Profesor</th>
                                    <th className="px-3 py-2 text-xs font-semibold text-gray-500"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {materiasCuatriActual.map((cm) => {
                                    const row = materiasForm[cm.id] || { dia: '', horario: '', aula: '', profesor: '' }
                                    const isAssigned = materiaIdsAsignadas.has(cm.id)
                                    const horarioExistente = horariosDeEsta.find((h) => h.carrera_materia_id === cm.id)
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
                                              <button onClick={() => removerMateriaDeComision(nombre, cm.id)}
                                                className="ml-1 text-red-400 hover:text-red-600 text-xs"
                                                title="Remover de esta comision"
                                              >&times;</button>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-3 py-2">
                                          <select value={row.dia} onChange={(e) => actualizarComisionField(nombre, cm.id, 'dia', e.target.value)}
                                            onBlur={() => handleBlur(nombre, cm.id)}
                                            className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[nombre]?.[cm.id]?.dia ? 'border-red-400' : 'border-gray-300'}`}
                                          >
                                            <option value="">—</option>
                                            {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                                          </select>
                                        </td>
                                        <td className="px-3 py-2">
                                          <input type="time" value={row.horario_inicio || ''}
                                            onChange={(e) => actualizarComisionField(nombre, cm.id, 'horario_inicio', e.target.value)}
                                            onBlur={() => handleBlur(nombre, cm.id)}
                                            className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[nombre]?.[cm.id]?.horario_inicio ? 'border-red-400' : 'border-gray-300'}`}
                                          />
                                        </td>
                                        <td className="px-3 py-2">
                                          <input type="time" value={row.horario_fin || ''}
                                            onChange={(e) => actualizarComisionField(nombre, cm.id, 'horario_fin', e.target.value)}
                                            onBlur={() => handleBlur(nombre, cm.id)}
                                            className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[nombre]?.[cm.id]?.horario_fin ? 'border-red-400' : 'border-gray-300'}`}
                                          />
                                        </td>
                                        {!esVirtual && (
                                          <td className="px-3 py-2">
                                            <input value={row.aula} onChange={(e) => actualizarComisionField(nombre, cm.id, 'aula', e.target.value)}
                                              onBlur={() => handleBlur(nombre, cm.id)}
                                              className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[nombre]?.[cm.id]?.aula ? 'border-red-400' : 'border-gray-300'}`}
                                              placeholder="Ej: 201"
                                            />
                                          </td>
                                        )}
                                        <td className="px-3 py-2">
                                          <input value={row.profesor} onChange={(e) => actualizarComisionField(nombre, cm.id, 'profesor', e.target.value)}
                                            onBlur={() => handleBlur(nombre, cm.id)}
                                            className={`w-full px-1.5 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores[nombre]?.[cm.id]?.profesor ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="Opcional"
                                          />
                                        </td>
                                        <td className="px-3 py-2">
                                          {horarioExistente && (
                                            <button onClick={() => borrarHorario(nombre, cm.id)}
                                              className="text-xs font-semibold text-red-500 hover:text-red-700"
                                              title="Eliminar horario"
                                            >Borrar</button>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-sm font-medium mb-1">Seleccioná una comisión</p>
                  <p className="text-gray-400 text-xs">Hacé clic en una comisión arriba para cargar horarios.</p>
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

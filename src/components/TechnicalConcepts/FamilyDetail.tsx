import { useEffect, useState } from "react";
import { Container, Carousel } from "react-bootstrap"; 
import { useParams, Link, useNavigate } from "react-router-dom"; // Agregué useNavigate por si acaso
import { dataHelper, type Family } from "../../utils/Helper"; 
import { routes } from "../../router";
import "../../css/ConceptCards/TechnicalConceptDetail.css"; 

// Interfaz extendida para manejar las imágenes correctamente
interface FamilyExtended extends Family {
  imagenes?: string[];
  urlImagen?: string;
}

export default function FamilyDetail() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const familyId = Number(id);

  const [family, setFamily] = useState<FamilyExtended | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Renombrado a loadData para evitar confusión con fetch API
    async function loadData() {
      if (!familyId || Number.isNaN(familyId)) {
        setLoading(false);
        return;
      }

      try {
        // 1. Cargar todas las familias (Axios)
        const realFamilies = await dataHelper.getRealFamilias();
        const fam = realFamilies.find((f) => f.idFamilia === familyId);

        if (!fam) {
          setFamily(undefined);
          setLoading(false);
          return;
        }

       // 2. Manejo de imágenes

        const imagenesBackend = fam.imagenes || [];

        // 3. Mapear a estructura local
        const mappedFamily: FamilyExtended = {
          idFamilies: fam.idFamilia,
          name: fam.nombreFamilia,
          descriptions: fam.descripcionFamilia,
          
          image: imagenesBackend.length > 0 ? imagenesBackend[0] : "", 
          
          imagenes: imagenesBackend, // Guardamos el array completo para el carrusel
          subFamily: [],
        };

        // 4. Cargar subfamilias (Axios)
        const realSubfamilies = await dataHelper.getRealSubfamiliasByFamilia(familyId);
        
        mappedFamily.subFamily = realSubfamilies.map((sub) => ({
          idSubfamilies: sub.idSubfamilia,
          familyId: familyId,
          name: sub.nombreSubfamilia,
          descriptions: sub.descripcionSubfamilia,

          subConcepto: [],
        }));

        setFamily(mappedFamily);
      } catch (error) {
        console.error("Error cargando detalle de familia:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [familyId]);

  // --- Renderizado: Carga ---
  if (loading) {
    return (
      <Container className="detail-container">
        <div className="detail-card text-center">
          <p>Cargando información...</p>
        </div>
      </Container>
    );
  }

  // --- Renderizado: No Encontrado ---
  if (!family) {
    return (
      <Container className="detail-container">
        <div className="detail-card text-center">
          <h2>Familia no encontrada</h2>
          <p>No fue posible encontrar la familia solicitada.</p>
          <div className="detail-actions">
            <Link to={routes.TechnicalConceptPage} className="btn btn-primary">
              Volver
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  // Definir imágenes a mostrar
  const imagesToShow = family.imagenes && family.imagenes.length > 0 ? family.imagenes : [];

  return (
    <>
      <Container className="detail-container">
        <div className="detail-card p-0 overflow-hidden">
          
          {/* HEADER */}
          <div className="p-4 border-bottom">
            <h1 className="mb-0">{family.name}</h1>
            <small className="text-muted">ID: {family.idFamilies}</small>
          </div>

          {/* CARRUSEL */}
          {imagesToShow.length > 0 ? (
            <Carousel interval={null} className="bg-light border-bottom">
              {imagesToShow.map((imgUrl, index) => (
                <Carousel.Item key={index}>
                  <div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
                    <img
                      className="d-block"
                      src={imgUrl}
                      alt={`Imagen ${index + 1}`}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
             <div className="text-center py-4 bg-light border-bottom text-muted">
               <small>Sin imágenes disponibles</small>
             </div>
          )}

          {/* DESCRIPCIÓN */}
          <div className="p-4 detail-description">
            <h5 className="mb-3">Descripción</h5>
            <p className="mb-0 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
              {family.descriptions || "Sin descripción disponible."}
            </p>
          </div>

          {/* SUBFAMILIAS */}
          {family.subFamily && family.subFamily.length > 0 && (
            <div className="p-4 bg-light border-top">
              <h4 className="mb-3">Subfamilias</h4>
              <div className="row g-3">
                {family.subFamily.map((sub) => (
                  <div key={sub.idSubfamilies} className="col-md-6 col-lg-4">
                    <Link
                      to={`/subfamilia/${sub.idSubfamilies}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="card h-100 shadow-sm hover-effect">
                        <div className="card-body">
                          <h6 className="card-title fw-bold">{sub.name}</h6>
                          <p className="card-text small text-muted text-truncate">
                            {sub.descriptions || "Sin descripción."}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* BOTONES */}
      <div className="detail-actions mt-4 text-center">
        <Link to={routes.TechnicalConceptPage} className="btn btn-primary">
          Volver al listado
        </Link>
      </div>
    </>
  );
}
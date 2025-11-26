import { Container } from "react-bootstrap";
import AdminConcepts from "../../components/Admin/adminConcept";

export default function AdminConceptPage() {
    return (
        <>
            <Container className="my-5">
                <AdminConcepts></AdminConcepts>
            </Container>
        </>
    )
}
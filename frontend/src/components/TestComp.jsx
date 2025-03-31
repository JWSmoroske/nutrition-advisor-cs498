import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';

const TestComponent = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse('Error: No response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error getting response. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Nutrition Chat</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="questionInput">
                  <Form.Label>Ask your nutrition-related question</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={loading}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Asking...
                      </>
                    ) : (
                      'Ask'
                    )}
                  </Button>
                </div>
              </Form>

              {response && (
                <Card className="mt-4">
                  <Card.Header>Response</Card.Header>
                  <Card.Body>
                    <Card.Text>{response}</Card.Text>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestComponent;

/**
 * Admin Quiz Page
 *
 * Quiz management with question sets and analytics
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface QuestionSet {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
}

const mockQuestionSets: QuestionSet[] = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Question set ${i + 1}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
  numberOfQuestions: 25,
}));

const mockAttempts = [
  { name: 'Quest set 1', partner: 80, dealer: 50 },
  { name: 'Quest set 2', partner: 60, dealer: 40 },
  { name: 'Quest set 3', partner: 90, dealer: 70 },
  { name: 'Quest set 4', partner: 45, dealer: 30 },
  { name: 'Quest set 5', partner: 70, dealer: 55 },
  { name: 'Quest set 6', partner: 55, dealer: 45 },
];

const QuizPage: React.FC = () => {
  const [questionSets, setQuestionSets] = useState(mockQuestionSets);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    questions: [{ question: '', options: [''] }] as { question: string; options: string[] }[],
  });

  const handleDelete = (id: string) => {
    setQuestionSets(questionSets.filter((q) => q.id !== id));
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: [''] }],
    });
  };

  const handleSave = () => {
    const newSet: QuestionSet = {
      id: `${questionSets.length + 1}`,
      title: formData.title || `Question set ${questionSets.length + 1}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      numberOfQuestions: formData.questions.length,
    };
    setQuestionSets([...questionSets, newSet]);
    setAddModalOpen(false);
    setFormData({ title: '', questions: [{ question: '', options: [''] }] });
  };

  return (
    <AdminLayout
      title="Quiz"
      showAddButton
      addButtonLabel="ADD NEW"
      onAddClick={() => setAddModalOpen(true)}
    >
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Side - Question Sets Grid */}
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={3}>
            {questionSets.map((set) => (
              <Grid item xs={12} sm={6} key={set.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {set.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {set.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                    Number of questions: {set.numberOfQuestions}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      size="small"
                      sx={{ color: '#3B82F6', textTransform: 'none', p: 0, minWidth: 'auto' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleDelete(set.id)}
                      sx={{ color: '#EF4444', textTransform: 'none', p: 0, minWidth: 'auto' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Right Side - Analytics */}
        <Paper
          elevation={0}
          sx={{
            width: 280,
            p: 3,
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Attempts by Partner Dealers
          </Typography>

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#FF6B35', borderRadius: '2px' }} />
              <Typography variant="caption">Partner</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#2D3142', borderRadius: '2px' }} />
              <Typography variant="caption">Dealer</Typography>
            </Box>
          </Box>

          {/* Bar Chart */}
          <Box sx={{ mb: 4 }}>
            {mockAttempts.map((attempt, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {attempt.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={attempt.partner}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#E5E7EB',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#FF6B35' },
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={attempt.dealer}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#E5E7EB',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#2D3142' },
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Total Attempts */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '4px solid #FF6B35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#FF6B35' }}>
                75%
                <br />
                Total
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Total Attempts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Chart Q2
              </Typography>
            </Box>
          </Box>

          {/* Dealer and Partner Attempts */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #FF6B35 50%, #2D3142 50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  50/50
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Dealer and Partner
                <br />
                Attempts
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Chart Q2
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Add Quiz Set Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pt: 3 }}>
          Add New Quiz Set
        </DialogTitle>
        <DialogContent sx={{ px: 4, py: 3 }}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 3 }}
          />

          {formData.questions.map((q, qIndex) => (
            <Box key={qIndex} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Question"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...formData.questions];
                  newQuestions[qIndex].question = e.target.value;
                  setFormData({ ...formData, questions: newQuestions });
                }}
                sx={{ mb: 2 }}
              />
              {q.options.map((opt, oIndex) => (
                <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Option"
                    size="small"
                    value={opt}
                    onChange={(e) => {
                      const newQuestions = [...formData.questions];
                      newQuestions[qIndex].options[oIndex] = e.target.value;
                      setFormData({ ...formData, questions: newQuestions });
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleAddOption(qIndex)}
                    sx={{ color: '#9CA3AF' }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ))}

          <Button
            onClick={handleAddQuestion}
            sx={{ color: '#FF6B35', textTransform: 'none' }}
          >
            Add New Question
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            sx={{
              backgroundColor: '#FF6B35',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              '&:hover': { backgroundColor: '#E85A2B' },
            }}
          >
            ADD QUIZ SET
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default QuizPage;

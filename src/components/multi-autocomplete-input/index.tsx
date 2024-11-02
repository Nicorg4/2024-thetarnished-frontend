import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';

interface Subject {
  subjectid: string;
  subjectname: string;
}

interface MultiAutocompleteInputProps {
  onSelect: (selectedOptions: { id: string; name: string }[]) => void;
  defaultValue?: Subject[];
  alternative?: boolean;
}

export default function MultiAutocompleteInput({ onSelect, defaultValue = [], alternative }: MultiAutocompleteInputProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const getAllSubjects = async () => {
      try {
        const response = await fetch(`${URL}subject/all-subjects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    getAllSubjects();
  }, [URL]);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      id="multiple-limit-tags"
      filterSelectedOptions
      options={subjects}
      getOptionLabel={(option: Subject) => option.subjectname}
      defaultValue={defaultValue}
      onChange={(_event, value) => {
        const selectedSubjects = value.map((option) => ({
          id: option.subjectid,
          name: option.subjectname,
        }));
        onSelect(selectedSubjects);
      }}
      renderTags={(value: Subject[], getTagProps) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            padding: '5px 0',
          }}
        >
          {value.map((option, index) => (
            <Chip
              label={option.subjectname}
              {...getTagProps({ index })}
              style={{ marginRight: 4 }}
            />
          ))}
        </div>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Subjects" placeholder="Add subject..." />
      )}
      sx={{
        '& .MuiAutocomplete-listbox': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
        },
      }}
      style={{ padding: 10, marginTop: 10, width: alternative ? '63%' : '300px' }}
    />
  );
}

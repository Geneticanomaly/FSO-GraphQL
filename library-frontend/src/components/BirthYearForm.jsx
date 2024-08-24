import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import Select from 'react-select';

const BirthYearForm = ({ authors }) => {
    const [name, setName] = useState('');
    const [bornDate, setBornDate] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.log(error.graphQLErrors[0].message);
        },
    });

    const options = authors.map((author) => ({
        value: author.name,
        label: author.name,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        const bornToNumber = Number(bornDate);
        editAuthor({ variables: { name: name, setBornTo: bornToNumber } });

        setName('');
        setBornDate('');
    };

    return (
        <div>
            <h2>Set birthYear</h2>
            <form onSubmit={handleSubmit}>
                <Select
                    name="name"
                    options={options}
                    value={options.find((option) => option.value === name) || ''}
                    onChange={(e) => setName(e.value)}
                    placeholder="Select an author"
                />
                <div>
                    born{' '}
                    <input
                        type="number"
                        name="born"
                        value={bornDate}
                        onChange={(e) => setBornDate(e.target.value)}
                    />
                </div>
                <button>update author</button>
            </form>
        </div>
    );
};

export default BirthYearForm;

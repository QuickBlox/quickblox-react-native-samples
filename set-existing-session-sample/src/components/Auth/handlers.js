const TOKEN_HINT =
  'Please enter your token.';

export const validate = values => {
  const errors = [];
  if (values.token) {
    if (!values.token) {
      errors.token = TOKEN_HINT;
    }
  } else {
    errors.token = TOKEN_HINT;
  }
  return errors;
};

export function useSubmitHandler(dispatch) {
  const submit = ({token}) => {
  };

  return submit;
}

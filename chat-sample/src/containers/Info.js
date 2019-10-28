import { connect } from 'react-redux'

import Info from '../components/Info'
import { getSdkInfo } from '../thunks'

const mapStateToProps = (state) => ({
  info: state.info
})

const mapDispatchToProps = { getSdkInfo }

export default connect(mapStateToProps, mapDispatchToProps)(Info)
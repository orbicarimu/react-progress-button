import React from 'react'
import PropTypes from 'prop-types'

export const STATE = {
  LOADING: 'loading',
  DISABLED: 'disabled',
  SUCCESS: 'success',
  ERROR: 'error',
  NOTHING: ''
}

const ProgressButton = React.createClass({
  propTypes: {
    classNamespace: PropTypes.string,
    durationError: PropTypes.number,
    durationSuccess: PropTypes.number,
    form: PropTypes.string,
    onClick: PropTypes.func,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    state: PropTypes.oneOf(Object.keys(STATE).map(k => STATE[k])),
    type: PropTypes.string,
    shouldAllowClickOnLoading: PropTypes.bool
  },

  getDefaultProps () {
    return {
      classNamespace: 'pb-',
      durationError: 1200,
      durationSuccess: 500,
      onClick () {},
      onError () {},
      onSuccess () {},
      shouldAllowClickOnLoading: false
    }
  },

  getInitialState () {
    return {
      currentState: this.props.state || STATE.NOTHING
    }
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.state === this.props.state) { return }
    switch (nextProps.state) {
      case STATE.SUCCESS:
        this.success()
        return
      case STATE.ERROR:
        this.error()
        return
      case STATE.LOADING:
        this.loading()
        return
      case STATE.DISABLED:
        this.disable()
        return
      case STATE.NOTHING:
        this.notLoading()
        return
      default:
        return
    }
  },

  componentWillUnmount () {
    clearTimeout(this._timeout)
  },

  render () {
    const {
      className,
      classNamespace,
      children,
      type,
      form,
      durationError, // eslint-disable-line no-unused-vars
      durationSuccess, // eslint-disable-line no-unused-vars
      onClick, // eslint-disable-line no-unused-vars
      onError, // eslint-disable-line no-unused-vars
      onSuccess, // eslint-disable-line no-unused-vars
      state, // eslint-disable-line no-unused-vars
      shouldAllowClickOnLoading, // eslint-disable-line no-unused-vars
      ...containerProps
    } = this.props

    containerProps.className = classNamespace + 'container ' + this.state.currentState + ' ' + className
    containerProps.onClick = this.handleClick
    return (
      <div {...containerProps}>
        <button type={type} form={form} className={classNamespace + 'button'}>
          <span>{children}</span>
          <svg className={classNamespace + 'progress-circle'} viewBox='0 0 41 41'>
            <path d='M38,20.5 C38,30.1685093 30.1685093,38 20.5,38' />
          </svg>
          <svg className={classNamespace + 'checkmark'} viewBox='0 0 70 70'>
            <path d='m31.5,46.5l15.3,-23.2' />
            <path d='m31.5,46.5l-8.5,-7.1' />
          </svg>
          <svg className={classNamespace + 'cross'} viewBox='0 0 70 70'>
            <path d='m35,35l-9.3,-9.3' />
            <path d='m35,35l9.3,9.3' />
            <path d='m35,35l-9.3,9.3' />
            <path d='m35,35l9.3,-9.3' />
          </svg>
        </button>
      </div>
    )
  },

  handleClick (e) {
    if ((this.props.shouldAllowClickOnLoading ||
      this.state.currentState !== 'loading') &&
      this.state.currentState !== 'disabled'
    ) {
      this.props.onClick(e)
    } else {
      e.preventDefault()
    }
  },

  loading (promise) {
    this.setState({currentState: 'loading'})
    if (promise && promise.then && promise.catch) {
      promise
        .then(() => {
          this.success()
        })
        .catch(() => {
          this.error()
        })
    }
  },

  notLoading () {
    this.setState({currentState: STATE.NOTHING})
  },

  enable () {
    this.setState({currentState: STATE.NOTHING})
  },

  disable () {
    this.setState({currentState: STATE.DISABLED})
  },

  success (callback, dontRemove) {
    this.setState({currentState: STATE.SUCCESS})
    this._timeout = setTimeout(() => {
      if (!dontRemove) { this.setState({currentState: STATE.NOTHING}) }
      callback = callback || this.props.onSuccess
      if (typeof callback === 'function') { callback() }
    }, this.props.durationSuccess)
  },

  error (callback) {
    this.setState({currentState: STATE.ERROR})
    this._timeout = setTimeout(() => {
      this.setState({currentState: STATE.NOTHING})
      callback = callback || this.props.onError
      if (typeof callback === 'function') { callback() }
    }, this.props.durationError)
  }
})

export default ProgressButton

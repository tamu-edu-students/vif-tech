class EventSignup < ApplicationRecord
  belongs_to :user
  belongs_to :event

  def as_json(options = {})
    ret = {}
    ret["user"] = self.user.as_json
    ret["event"] = self.event.as_json
    return ret
  end
end
